import { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Table, Key, Star, ChevronRight, Hash, Code, CheckCircle, Info, Layers, Circle } from 'lucide-react';

interface SchemaField {
  name: string;
  type: string;
  isId?: boolean;
  isUnique?: boolean;
  isNullable?: boolean;
  relationTo?: string;
}

interface SchemaTable {
  name: string;
  description: string;
  fields: SchemaField[];
}

export function DatabaseVisualizer() {
  const [activeModel, setActiveModel] = useState<string>('UserProfile');

  const tables: SchemaTable[] = [
    {
      name: "UserProfile",
      description: "Holds professional online identity profile logs.",
      fields: [
        { name: "id", type: "String", isId: true },
        { name: "fullName", type: "String" },
        { name: "headline", type: "String" },
        { name: "about", type: "String", isNullable: true },
        { name: "location", type: "String" },
        { name: "githubUsername", type: "String", isUnique: true, isNullable: true },
        { name: "skills", type: "String[]" },
        { name: "profileStrength", type: "Int" },
        { name: "connections", type: "NetworkConnection[]", relationTo: "NetworkConnection" },
        { name: "posts", type: "SocialPost[]", relationTo: "SocialPost" }
      ]
    },
    {
      name: "NetworkConnection",
      description: "Tracks professional communication networks.",
      fields: [
        { name: "id", type: "String", isId: true },
        { name: "userId", type: "String", relationTo: "UserProfile" },
        { name: "fullName", type: "String" },
        { name: "avatar", type: "String" },
        { name: "headline", type: "String" },
        { name: "status", type: "String" } // "Connected" | "Pending" | "Declined"
      ]
    },
    {
      name: "JobListing",
      description: "Contains posted career positions and applicants.",
      fields: [
        { name: "id", type: "String", isId: true },
        { name: "title", type: "String" },
        { name: "companyName", type: "String" },
        { name: "companyLogo", type: "String" },
        { name: "location", type: "String" },
        { name: "type", type: "String" }, // "Remote" | "Hybrid" | "Onsite"
        { name: "salaryRange", type: "String" },
        { name: "experienceLevel", type: "String" },
        { name: "description", type: "String" },
        { name: "requirements", type: "String[]" },
        { name: "skillsRequired", type: "String[]" },
        { name: "applicantsCount", type: "Int" },
        { name: "hasApplied", type: "Boolean" }
      ]
    },
    {
      name: "SocialPost",
      description: "Interactive timeline posts containing career logs.",
      fields: [
        { name: "id", type: "String", isId: true },
        { name: "authorId", type: "String", relationTo: "UserProfile" },
        { name: "authorName", type: "String" },
        { name: "authorHeadline", type: "String" },
        { name: "authorAvatar", type: "String" },
        { name: "content", type: "String" },
        { name: "likesCount", type: "Int" },
        { name: "commentsCount", type: "Int" },
        { name: "hasLiked", type: "Boolean" },
        { name: "isCareerUpdate", type: "Boolean" }
      ]
    }
  ];

  const currentTable = tables.find(t => t.name === activeModel) || tables[0];

  return (
    <div id="db_visualizer_panel" className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Visualizer header summary */}
      <div className="mb-8 text-left">
        <h2 className="text-xl font-display font-bold text-sleek-heading tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" /> Relational Architecture
        </h2>
        <p className="text-xs text-sleek-muted font-sans mt-1">Explore current operational relational schema mappings designed for PostgreSQL & Prisma workflows.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left column: tables inventory list */}
        <div className="lg:col-span-4 p-5 bg-sleek-card border border-sleek-main rounded-2xl shadow-sm space-y-4">
          <span className="text-[10px] uppercase font-bold text-sleek-muted tracking-widest block font-display">Prisma Client Entities</span>
          <div className="space-y-1.5">
            {tables.map((tbl) => (
              <button
                key={tbl.name}
                onClick={() => setActiveModel(tbl.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-semibold font-sans transition-all text-left cursor-pointer ${
                  activeModel === tbl.name
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-sm'
                    : 'bg-sleek-input border-sleek-input text-sleek-muted hover:border-sleek-main hover:text-sleek-heading'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-400" /> {tbl.name}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeModel === tbl.name ? 'rotate-90 text-indigo-400' : 'text-sleek-muted'}`} />
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-sleek-main flex items-center gap-2 text-[10px] text-sleek-muted leading-relaxed font-sans">
            <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Select any database entity schema list to review key relationship markers.</span>
          </div>
        </div>

        {/* Right column: ER interactive table card */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-sleek-card border border-sleek-main rounded-2xl p-6 shadow-sm">
            
            <div className="border-b border-sleek-main pb-4 mb-4">
              <span className="text-[10px] font-bold text-indigo-410 font-mono tracking-widest uppercase block mb-1">Entity Details</span>
              <h3 className="font-display font-bold text-sm text-sleek-heading flex items-center gap-1.5">
                model {currentTable.name}
              </h3>
              <p className="text-xs text-sleek-muted mt-1 leading-normal font-sans">{currentTable.description}</p>
            </div>

            {/* List fields in monospace style (representing database rows) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-[11px] sm:text-xs">
                <thead>
                  <tr className="border-b border-sleek-main text-sleek-muted uppercase text-[9px] font-bold tracking-wider font-display">
                    <th className="py-2 pb-3">Field</th>
                    <th className="py-2 pb-3">Type</th>
                    <th className="py-2 pb-3">Attributes</th>
                    <th className="py-2 pb-3 text-right">Relationship</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sleek-main/60">
                  {currentTable.fields.map((field) => (
                    <tr key={field.name} className="hover:bg-sleek-input/20 transition-all">
                      <td className="py-3 font-semibold text-sleek-heading flex items-center gap-1.5">
                        {field.isId ? (
                          <Key className="w-3.5 h-3.5 text-amber-500" title="Primary Key" />
                        ) : (
                          <Circle className="w-2.5 h-2.5 text-indigo-400 fill-indigo-400/20" />
                        )}
                        {field.name}
                      </td>
                      <td className="py-3 text-sleek-main font-semibold text-indigo-400 font-bold">{field.type}</td>
                      <td className="py-3 text-sleek-muted">
                        <div className="flex flex-wrap gap-1">
                          {field.isId && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[8px] uppercase border border-amber-500/10">ID</span>}
                          {field.isUnique && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[8px] uppercase border border-emerald-500/10">Unique</span>}
                          {field.isNullable && <span className="px-1.5 py-0.5 rounded bg-sleek-input text-sleek-muted text-[8px] border border-sleek-main">Optional</span>}
                        </div>
                      </td>
                      <td className="py-3 text-right font-semibold text-indigo-300">
                        {field.relationTo ? (
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
                            → {field.relationTo}
                          </span>
                        ) : (
                          <span className="text-sleek-muted font-sans text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Database code registry syntax mockup display */}
          <div className="bg-sleek-card border border-sleek-main rounded-2xl p-6 shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-sleek-main pb-4 mb-4">
              <h4 className="text-xs font-semibold text-sleek-heading font-display">Prisma DB Registry Schema Script</h4>
              <span className="text-[9px] bg-indigo-500/10 text-indigo-400 font-mono px-2 py-0.5 rounded border border-indigo-500/10 font-bold uppercase">Schema.prisma</span>
            </div>
            
            <pre className="bg-sleek-input border border-sleek-input text-sleek-main font-mono text-[10px] sm:text-xs rounded-xl p-4 leading-relaxed overflow-x-auto whitespace-pre">
{`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model ${currentTable.name} {
${currentTable.fields.map(f => {
  let attrs = '';
  if (f.isId) attrs += ' @id @default(uuid())';
  if (f.isUnique) attrs += ' @unique';
  const typeStr = f.isNullable ? `${f.type}?` : f.type;
  return `  ${f.name.padEnd(16)} ${typeStr.padEnd(12)}${attrs}`;
}).join('\n')}
}`}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
}
