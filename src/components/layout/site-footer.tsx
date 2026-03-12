'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

const publicPages = [
    { title: "Home", url: "/" },
    { title: "About", url: "/#about" },
    { title: "Arenas", url: "/arenas" },
    { title: "Team", url: "/team" },
    { title: "Timeline", url: "/timeline" },
];

const connectLinks = [
    { title: "Announcement", url: "/announcements" },
    { title: "Contact Us", url: "/contact" },
    { title: "Register", url: "/register" },
    { title: "Terms and conditions", url: "/terms-of-entry" },
    { title: "Privacy policy", url: "/privacy-protocol" },
    { title: "Code of Conduct", url: "/code-of-conduct" },
];


function FooterLinkColumn({ title, links }: { title: string, links: {title: string, url: string}[]}) {
    return (
        <div className="space-y-4">
            <h3 className="font-headline text-xs tracking-[0.2em] text-accent uppercase font-bold">{title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
                {links.map(link => (
                    <li key={link.title}><Link href={link.url} className="hover:text-primary transition-colors">{link.title}</Link></li>
                ))}
            </ul>
        </div>
    );
}

export function SiteFooter() {
    const { Mail, MapPin, Instagram } = LucideIcons;

    return (
        <footer className="pt-20 pb-40 px-6 border-t border-primary/10 mt-20 bg-black/20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <h2 className="font-headline text-2xl text-primary tracking-wider uppercase">TECH KURUKSHETRA</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    The most immersive tech battlefield of the year. Join 5,000+ warriors of code to reshape the future.
                    </p>
                </div>

                <FooterLinkColumn title="Public Pages" links={publicPages} />
                
                <FooterLinkColumn title="Connect" links={connectLinks} />
                
                <div className="space-y-4">
                    <h3 className="font-headline text-xs tracking-[0.2em] text-accent uppercase font-bold">Location and Contact</h3>
                    <ul className="space-y-4 text-sm text-muted-foreground font-light">
                        <li className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-primary mt-1 shrink-0" />
                            <a href="mailto:btech_events@svgu.ac.in" className="hover:text-primary transition-colors">btech_events@svgu.ac.in</a>
                        </li>
                        <li className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                            <span>Chimanbhai Patel Institute Campus, SG Highway, Near Prahlad Nagar, Ahmedabad, Gujarat - 380015.</span>
                        </li>
                        <li className="flex items-start gap-3">
                             <Instagram className="w-4 h-4 text-primary mt-1 shrink-0" />
                            <a href="https://www.instagram.com/svgutechkurukshetra" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/50 font-medium">
                <p>© {new Date().getFullYear()} TECH KURUKSHETRA. All rights reserved.</p>
                <p className="tracking-widest uppercase">Design and Develop by <a href="https://www.linkedin.com/in/mohammad-khizer-shaikh-14a362275/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Mohammed Khizer</a> and <a href="https://www.linkedin.com/in/0xdhy4n/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Dhyan Jain</a></p>
            </div>
        </footer>
    );
}
