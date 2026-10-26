/**
 * ti_c26_icon() (theme includes/course-2026.php): the same Lucide SVGs, with the
 * class replaced and aria-hidden / focusable added, as the theme prints them.
 */
const ICONS: Record<string, string> = {
  "arrow-right": "<path d=\"M5 12h14\"></path><path d=\"m12 5 7 7-7 7\"></path>",
  "award": "<path d=\"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526\"></path><circle cx=\"12\" cy=\"8\" r=\"6\"></circle>",
  "briefcase": "<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"></path><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"></rect>",
  "check": "<path d=\"M20 6 9 17l-5-5\"></path>",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\"></path>",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><polyline points=\"12 6 12 12 16 14\"></polyline>",
  "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"></line>",
  "file-badge": "<path d=\"M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3\"></path><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"></path><path d=\"M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z\"></path><path d=\"M7 16.5 8 22l-3-1-3 1 1-5.5\"></path>",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"></path><path d=\"M2 12h20\"></path>",
  "laptop": "<path d=\"M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16\"></path>",
  "life-buoy": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"m4.93 4.93 4.24 4.24\"></path><path d=\"m14.83 9.17 4.24-4.24\"></path><path d=\"m14.83 14.83 4.24 4.24\"></path><path d=\"m9.17 14.83-4.24 4.24\"></path><circle cx=\"12\" cy=\"12\" r=\"4\"></circle>",
  "play": "<polygon points=\"6 3 20 12 6 21 6 3\"></polygon>",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"></circle><path d=\"m21 21-4.3-4.3\"></path>",
  "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"></path><path d=\"m9 12 2 2 4-4\"></path>",
  "star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"></path>",
  "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"></path><circle cx=\"12\" cy=\"7\" r=\"4\"></circle>",
  "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"></path><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"></path>",
};

export default function Icon({ name, className = "c26-icon" }: { name: string; className?: string }) {
  const inner = ICONS[name];
  if (!inner) return null;
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
