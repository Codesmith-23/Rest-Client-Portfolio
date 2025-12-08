'use client';
import { motion } from 'framer-motion';
import { User, Experience, SkillsCategories } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TextScramble } from '@/components/animations/TextScramble';
import { TechMarquee } from '@/components/animations/TechMarquee';
import { LiveMetricsGraph } from '@/components/ui/LiveMetricsGraph';
import { Download, MapPin, GraduationCap, Briefcase, Circle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ProfileCardProps {
  user: User;
  experience: Experience[];
  skillsCategories: SkillsCategories;
  languageStats: Array<{ name: string; percent: number; color: string }>;
  startAnimation?: boolean;
}

export function ProfileCard({ user, experience, skillsCategories, languageStats, startAnimation = true }: ProfileCardProps) {
  // Helper function to get clean initials (First + Last)
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    // Take first char of first name + first char of last name
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="min-h-full p-4 md:p-6 pb-24 max-w-6xl mx-auto">
      {/* Header Section with Text Scramble */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8">
            <div className="absolute inset-0 bg-black/20" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-lg opacity-50" />
                <Avatar className="relative w-32 h-32 border-4 border-white/20 ring-4 ring-white/10 overflow-hidden rounded-full">
                  <AvatarImage src={user.avatar_url} alt={user.name} loading="eager" className="object-cover aspect-square" />
                  <AvatarFallback className="text-3xl bg-slate-800 text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Name and Role with Scramble Effect */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 font-mono">
                  <TextScramble text={user.name} startAnimation={startAnimation} />
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-3 font-mono">
                  <TextScramble text={user.role} speed={60} startAnimation={startAnimation} />
                </p>
                <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                
                {/* Language Stats Bar */}
                <div className="mb-4">
                  <div className="flex h-2 rounded-full overflow-hidden border border-white/20">
                    {languageStats.map((lang, index) => (
                      <div
                        key={index}
                        className="relative group"
                        style={{
                          width: `${lang.percent}%`,
                          backgroundColor: lang.color,
                        }}
                        title={`${lang.name}: ${lang.percent}%`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Status Badges with Pulsing Dot */}
                <div className="flex flex-wrap gap-2">
                  {user.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 flex items-center gap-1.5">
                      {badge.includes('Experience') && (
                        <Circle className="w-2 h-2 fill-green-400 text-green-400 animate-pulse" />
                      )}
                      <span className="text-xs">{badge}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tech Stack Marquee - Hidden on mobile */}
          <div className="hidden md:block">
            <TechMarquee />
          </div>
          
          {/* Summary Text with Shimmer */}
          <CardContent className="pt-2 pb-6 px-6">
            <p className="text-center text-xl font-bold leading-relaxed bg-clip-text text-transparent animate-shimmer bg-gradient-to-r from-slate-500 via-white to-slate-500 bg-[length:200%_auto]">
              {user.summary}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Experience Timeline */}
      <div className="mb-8">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-100 font-mono">Experience</h2>
          </div>
          
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 border-l-2 border-slate-700 pb-6 last:pb-0"
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900" />
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{exp.role}</h3>
                      <p className="text-slate-400">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs whitespace-nowrap">{exp.date}</Badge>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skills Section with Scroll-Triggered Animation */}
      <div className="mb-8">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <h2 className="text-2xl font-bold text-slate-100 font-mono mb-6">Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skillsCategories).map(([category, skills]) => (
              <div
                key={category}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-slate-200 font-mono">{category}</h3>
                
                <div className="space-y-3">
                  {skills.map((skill: any, skillIndex: number) => {
                    const IconComponent = (LucideIcons as any)[skill.icon] || LucideIcons.Code;
                    
                    return (
                      <div key={skillIndex} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{skill.name}</span>
                          </div>
                          <span className="text-slate-500 font-mono text-xs">{skill.percent}%</span>
                        </div>
                        
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.percent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Education & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column - Education + Live Graph */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-400 font-mono uppercase tracking-wider">ACADEMIC_LOG</h3>
            </div>
            <div className="space-y-3">
              <p className="text-base font-semibold text-slate-100">{user.education.degree}</p>
              <p className="text-sm text-slate-400">{user.education.college}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Badge variant="outline" className="text-xs border-slate-600 font-mono">{user.education.year}</Badge>
                <Badge variant="outline" className="text-xs border-green-600 text-green-400 font-mono">CGPA: {user.education.cgpa}</Badge>
              </div>
            </div>
          </Card>

          {/* Live Metrics Graph */}
          <LiveMetricsGraph />
        </div>

        {/* Right Column - Certifications */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <LucideIcons.Award className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-400 font-mono uppercase tracking-wider">COMPLIANCE_CERTS</h3>
          </div>
          <div className="space-y-3">
            {user.certifications.map((cert, index) => (
              <a
                key={index}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-md hover:border-green-500/30 transition-all group"
              >
                <LucideIcons.CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-200 text-sm md:text-base">{cert.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{cert.issuer}</p>
                </div>
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* Full-Width Download Button */}
      <Button
        asChild
        size="lg"
        className="w-full h-14 bg-green-600 hover:bg-green-500 text-black font-bold uppercase tracking-widest font-mono shadow-lg shadow-green-900/20 transition-all"
      >
        <a 
          href="/resume.pdf" 
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3"
        >
          <span>DOWNLOAD_FULL_LOGS (RESUME.PDF)</span>
          <Download className="w-5 h-5" />
        </a>
      </Button>
    </div>
  );
}
