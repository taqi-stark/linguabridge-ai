import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, UserPlus, MessageCircle, MapPin, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/community")({ component: CommunityHub });

const MOCK_USERS = [
  { id: 1, name: "Sarah Jenkins", role: "Moving to France", target: "FR", native: "EN", avatar: "SJ" },
  { id: 2, name: "Ali Taqi", role: "Moving to Germany", target: "DE", native: "EN", avatar: "AT" },
  { id: 3, name: "Maria Garcia", role: "Moving from Spain to UK", target: "EN", native: "ES", avatar: "MG" },
  { id: 4, name: "Lucas Müller", role: "Moving to Italy", target: "IT", native: "DE", avatar: "LM" },
];

function CommunityHub() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Campus Hub Directory"
        description="Your global network of expats and international students."
        badge={
          <div className="text-sm font-medium bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full inline-flex items-center gap-2">
            <Users className="h-4 w-4"/> Multiplayer Alpha
          </div>
        }
      />

      <div className="mt-6 mb-8 bg-card border border-primary/20 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex-1 space-y-3 z-10">
          <h2 className="text-xl font-display font-bold">How Matchmaking Works</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Campus Hub actively connects you with language partners heading to your exact destination. 
            When you click <strong>Multiplayer</strong>, you enter a real-time Voice Room. Our engine acts as an instant interpreter between your <span className="font-bold text-foreground">Native</span> language and their native language, allowing you to fluidly practice <span className="font-bold text-foreground">Target</span> scenarios without breaking immersion.
          </p>
        </div>
        <div className="w-full md:w-auto shrink-0 z-10">
           <Button className="w-full md:w-auto rounded-full"><UserPlus className="h-4 w-4 mr-2"/> Setup Profile Match</Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search by destination country or university..." 
              className="w-full bg-card border border-border/50 rounded-full h-10 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:border-primary/40 focus:ring-primary/40"
            />
          </div>
          <Button variant="outline" className="rounded-full shadow-sm bg-card border-border/50"><MapPin className="h-4 w-4 mr-2"/> Near me</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_USERS.map((u) => (
            <div key={u.id} className="bg-card border border-border/50 rounded-xl p-5 shadow-sm hover:border-primary/30 transition-all flex flex-col justify-between">
               <div className="flex items-start justify-between">
                 <div className="flex gap-3 items-center">
                   <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display font-bold">
                     {u.avatar}
                   </div>
                   <div>
                     <div className="font-semibold text-foreground tracking-tight">{u.name}</div>
                     <div className="text-sm text-muted-foreground">{u.role}</div>
                   </div>
                 </div>
               </div>

               <div className="mt-4 flex gap-2">
                 <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-md">Native: {u.native}</span>
                 <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">Learning: {u.target}</span>
               </div>

               <div className="mt-6 flex gap-2">
                 <Button className="flex-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none"><UserPlus className="h-4 w-4 mr-2"/> Connect</Button>
                 <Button className="flex-1 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm border border-primary/20"><MessageCircle className="h-4 w-4 mr-2"/> Multiplayer</Button>
               </div>
            </div>
          ))}

          {/* Add Self Skeleton */}
           <div className="bg-card border border-dashed border-border/60 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center min-h-[200px] text-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
              <Users className="h-8 w-8 text-muted-foreground mb-3"/>
              <div className="font-semibold">Complete your profile</div>
              <div className="text-xs text-muted-foreground mt-1 px-4">Add your destination university to appear in the directory.</div>
           </div>
        </div>
      </div>
    </div>
  );
}
