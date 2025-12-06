import React from 'react';

interface JsonViewerProps {
  data: unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const renderValue = (value: unknown, depth: number = 0): string => {
    const indent = '  '.repeat(depth);
    const nextIndent = '  '.repeat(depth + 1);

    if (value === null) {
      return 'null';
    }

    if (typeof value === 'string') {
      return `"${value}"`;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return '[]';
      }
      const items = value.map((item) => `${nextIndent}${renderValue(item, depth + 1)}`).join(',\n');
      return `[\n${items}\n${indent}]`;
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 0) {
        return '{}';
      }
      const items = keys
        .map((key) => `${nextIndent}"${key}": ${renderValue((value as Record<string, unknown>)[key], depth + 1)}`)
        .join(',\n');
      return `{\n${items}\n${indent}}`;
    }

    return String(value);
  };

  const highlightJson = (jsonString: string): React.ReactNode[] => {
    const lines = jsonString.split('\n');
    return lines.map((line, index) => {
      const parts: React.ReactNode[] = [];
      let currentIndex = 0;

      // Match keys (property names in quotes)
      const keyRegex = /"([^"]+)":/g;
      let match;
      const matches: Array<{ start: number; end: number; type: string }> = [];

      while ((match = keyRegex.exec(line)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length - 1, // exclude the colon
          type: 'key',
        });
      }

      // Match string values (strings after colons)
      const stringRegex = /:\s*"([^"]*)"/g;
      while ((match = stringRegex.exec(line)) !== null) {
        const colonIndex = match.index;
        const stringStart = line.indexOf('"', colonIndex + 1);
        matches.push({
          start: stringStart,
          end: stringStart + match[1].length + 1,
          type: 'string',
        });
      }

      // Match numbers
      const numberRegex = /:\s*(\d+\.?\d*)/g;
      while ((match = numberRegex.exec(line)) !== null) {
        const colonIndex = match.index;
        const numberStart = line.indexOf(match[1], colonIndex);
        matches.push({
          start: numberStart,
          end: numberStart + match[1].length - 1,
          type: 'number',
        });
      }

      // Match booleans and null
      const boolNullRegex = /:\s*(true|false|null)/g;
      while ((match = boolNullRegex.exec(line)) !== null) {
        const colonIndex = match.index;
        const valueStart = line.indexOf(match[1], colonIndex);
        matches.push({
          start: valueStart,
          end: valueStart + match[1].length - 1,
          type: 'boolean',
        });
      }

      // Sort matches by start position
      matches.sort((a, b) => a.start - b.start);

      // Build the highlighted line
      matches.forEach((m, i) => {
        // Add text before this match
        if (currentIndex < m.start) {
          parts.push(
            <span key={`${index}-text-${i}`}>{line.substring(currentIndex, m.start)}</span>
          );
        }

        // Add the highlighted match
        const text = line.substring(m.start, m.end + 1);
        const colorClass =
          m.type === 'key'
            ? 'text-cyan-400'
            : m.type === 'string'
            ? 'text-green-400'
            : m.type === 'number'
            ? 'text-blue-400'
            : 'text-purple-400';

        parts.push(
          <span key={`${index}-${m.type}-${i}`} className={colorClass}>
            {text}
          </span>
        );

        currentIndex = m.end + 1;
      });

      // Add remaining text
      if (currentIndex < line.length) {
        parts.push(<span key={`${index}-end`}>{line.substring(currentIndex)}</span>);
      }

      return (
        <div key={index}>
          {parts.length > 0 ? parts : line}
          {index < lines.length - 1 && '\n'}
        </div>
      );
    });
  };

  const jsonString = renderValue(data);
  const highlighted = highlightJson(jsonString);

  return (
    <div className="h-full overflow-auto bg-slate-950 p-6">
      <pre className="font-mono text-sm leading-relaxed text-slate-200">{highlighted}</pre>
    </div>
  );
}
