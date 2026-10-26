/** Data from `tefl/v1/native/meet-the-team` (wordpress/headless/native/meet-the-team.php). */
export interface TeamMember {
  image: string;
  position: string;
  name: string;
  title: string;
  about: string;
}

export interface TeamPageData {
  ok: true;
  path: string;
  country: string;
  title: string;
  subtitle: string;
  management: TeamMember[];
  council: TeamMember[];
  contact: { heading: string; items: { icon: string; title: string; subtitle: string; details: string }[]; has_items: boolean };
}
