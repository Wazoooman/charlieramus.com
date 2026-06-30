import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const webProjects = [
  {
    // CUSTOMIZE: add screenshot to public/images/web/ and set src here
    thumbnail: "/images/web/project-1.webp",
    // CUSTOMIZE: project title
    title: "Project Name",
    // CUSTOMIZE: set href to live URL or GitHub link
    href: "https://github.com/charlieramus",
    // CUSTOMIZE: describe what the site is, who it was for, what you built
    description: "",
    // CUSTOMIZE: e.g. "2024"
    date: "2024",
    // CUSTOMIZE: add tech or design tool strings to tags array
    tags: ["Web Design", "Development"],
  },
  // --- PROJECT 2: copy structure above ---
  {
    // CUSTOMIZE: add screenshot to public/images/web/ and set src here
    thumbnail: "/images/web/project-2.webp",
    // CUSTOMIZE: project title
    title: "Project Name",
    // CUSTOMIZE: set href to live URL or GitHub link
    href: "https://github.com/charlieramus",
    // CUSTOMIZE: describe what the site is, who it was for, what you built
    description: "",
    // CUSTOMIZE: e.g. "2024"
    date: "2024",
    // CUSTOMIZE: add tech or design tool strings to tags array
    tags: ["Web Design", "Development"],
  },
  // --- PROJECT 3: copy structure above ---
  {
    // CUSTOMIZE: add screenshot to public/images/web/ and set src here
    thumbnail: "/images/web/project-3.webp",
    // CUSTOMIZE: project title
    title: "Project Name",
    // CUSTOMIZE: set href to live URL or GitHub link
    href: "https://github.com/charlieramus",
    // CUSTOMIZE: describe what the site is, who it was for, what you built
    description: "",
    // CUSTOMIZE: e.g. "2024"
    date: "2024",
    // CUSTOMIZE: add tech or design tool strings to tags array
    tags: ["Web Design", "Development"],
  },
];

export default function WebProjects() {
  return (
    <div className="flex flex-col gap-10">
      {webProjects.map((project, i) => (
        <div
          key={i}
          className="flex gap-5 -mx-3 px-3 py-3 rounded-lg hover:bg-surface transition-colors duration-200"
        >
          {/* Thumbnail */}
          <div className="relative w-22 h-16.5 shrink-0 rounded-sm overflow-hidden bg-surface">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[15px] font-medium text-fg hover:text-red transition-colors duration-200"
              >
                {project.title}
                <ArrowUpRight size={14} className="shrink-0" />
              </a>
              <span className="text-[12px] text-muted ml-4 shrink-0">{project.date}</span>
            </div>
            {project.description && (
              <p className="text-[13px] text-muted leading-[1.7] mb-2">
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2.5 py-1 bg-surface text-red rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
