import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Star, Github, Linkedin, Globe, MessageSquare, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CandidateProfilePreviewProps {
  developer: {
    name: string;
    email: string;
    title: string;
    bio: string;
    location: string;
    avatar?: string;
    initials: string;
    skills: string[];
    experience: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
    aiScore: number;
    matchReason: string;
  };
  onMessage?: () => void;
  onShortlist?: () => void;
}

export default function CandidateProfilePreview({ developer, onMessage, onShortlist }: CandidateProfilePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl overflow-hidden"
    >
      {/* Header Banner */}
      <div className="h-24 bg-gradient-to-r from-[var(--gradient-liquid)] to-primary/30 relative">
        <div className="absolute inset-0 bg-[url('/mesh-bg.svg')] opacity-30" />
      </div>

      {/* Profile Section */}
      <div className="px-8 pb-8 -mt-12 relative">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-5">
            <Avatar className="size-24 border-4 border-background shadow-lg">
              <AvatarImage src={developer.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-4xl font-display text-primary-foreground">
                {developer.initials}
              </AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <h2 className="font-display text-2xl font-bold">{developer.name}</h2>
              <p className="text-muted-foreground">{developer.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <Sparkles className="size-4 text-primary" />
            <span className="font-bold text-primary">{developer.aiScore}% Match</span>
          </div>
        </div>

        {/* AI Match Reason */}
        <div className="mt-4 p-3 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-start gap-2">
            <Sparkles className="size-4 text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Why this match?</p>
              <p className="text-sm text-foreground/90">{developer.matchReason}</p>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 mt-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {developer.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {developer.experience} experience
          </div>
        </div>

        {/* Bio */}
        <p className="mt-5 text-foreground/90 leading-relaxed">{developer.bio}</p>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {developer.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="py-1.5 px-3">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-3 mt-6">
          {developer.github && (
            <Button variant="outline" size="sm" asChild>
              <a href={developer.github} target="_blank" rel="noreferrer">
                <Github className="size-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
          {developer.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <a href={developer.linkedin} target="_blank" rel="noreferrer">
                <Linkedin className="size-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          )}
          {developer.portfolio && (
            <Button variant="outline" size="sm" asChild>
              <a href={developer.portfolio} target="_blank" rel="noreferrer">
                <Globe className="size-4 mr-2" />
                Portfolio
              </a>
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-border">
          <Button onClick={onMessage} className="flex-1">
            <MessageSquare className="size-4 mr-2" />
            Message
          </Button>
            <Button onClick={onShortlist} variant="outline" className="flex-1">
              <Star className="size-4 mr-2" />
              Shortlist
            </Button>
          </div>
        </div>
      </motion.div>
  );
}
