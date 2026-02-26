
'use client';

import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';

const defaultLinks = {
    festival: [ { title: "Home", url: "/" }, { title: "Arenas", url: "/arenas" }, { title: "Timeline", url: "/timeline" } ],
    connect: [ { title: "Announcements", url: "/announcements" }, { title: "The Architects", url: "/team" }, { title: "Contact Us", url: "/contact" }, { title: "Get Your Pass", url: "/register" } ],
    legal: [ { title: "Privacy Protocol", url: "/privacy-protocol" }, { title: "Terms of Entry", url: "/terms-of-entry" } ],
};

const defaultSocials = [
    { id: 'insta', platform: 'Instagram', iconName: 'Instagram', url: '#' },
    { id: 'twitter', platform: 'Twitter', iconName: 'Twitter', url: '#' },
    { id: 'linkedin', platform: 'LinkedIn', iconName: 'Linkedin', url: '#' },
    { id: 'github', platform: 'Github', iconName: 'Github', url: '#' },
    { id: 'mail', platform: 'Mail', iconName: 'Mail', url: 'btech_events@svgu.ac.in' },
];

function FooterLinkColumn({ title, links, isLoading }: { title: string, links: {title: string, url: string}[], isLoading: boolean }) {
    return (
        <div className="space-y-4">
            <h3 className="font-headline text-xs tracking-[0.2em] text-accent uppercase font-bold">{title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
                {isLoading ? (
                    <>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </>
                ) : (
                    links.map(link => (
                        <li key={link.title}><Link href={link.url} className="hover:text-primary transition-colors">{link.title}</Link></li>
                    ))
                )}
            </ul>
        </div>
    );
}

export function SiteFooter() {
    const firestore = useFirestore();
    
    const footerLinksQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'footerLinks'), orderBy('displayOrder')) : null, [firestore]);
    const { data: footerLinksData, isLoading: footerLinksLoading } = useCollection(footerLinksQuery);
    
    const socialLinksQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'socialMediaLinks'), orderBy('displayOrder')) : null, [firestore]);
    const { data: socialLinksData, isLoading: socialLinksLoading } = useCollection(socialLinksQuery);
    
    const footerLinks = useMemo(() => {
        if (footerLinksLoading || !footerLinksData || footerLinksData.length === 0) return defaultLinks;
        return {
            festival: footerLinksData.filter(l => l.category === 'Festival'),
            connect: footerLinksData.filter(l => l.category === 'Connect'),
            legal: footerLinksData.filter(l => l.category === 'Legal'),
        }
    }, [footerLinksData, footerLinksLoading]);

    const socialLinks = useMemo(() => {
        if (socialLinksLoading || !socialLinksData || socialLinksData.length === 0) return defaultSocials;
        return socialLinksData.filter(link => link.url && link.url !== '#');
    }, [socialLinksData, socialLinksLoading]);

    return (
        <footer className="pt-20 pb-40 px-6 border-t border-primary/10 mt-20 bg-black/20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4">
                <h2 className="font-headline text-2xl text-primary tracking-wider uppercase">TECH KURUKSHETRA</h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                The most immersive tech battlefield of the year. Join 50,000+ warriors of code to reshape the future.
                </p>
            </div>

            <FooterLinkColumn title="Festival" links={footerLinks.festival} isLoading={footerLinksLoading} />
            
            <div className="space-y-4">
                <h3 className="font-headline text-xs tracking-[0.2em] text-accent uppercase font-bold">Connect</h3>
                <ul className="space-y-2 text-sm text-muted-foreground font-light">
                    {footerLinksLoading ? (
                        <>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </>
                    ) : (
                         footerLinks.connect.map(link => (
                            <li key={link.title}><Link href={link.url} className="hover:text-primary transition-colors">{link.title}</Link></li>
                        ))
                    )}
                </ul>
                <div className="flex items-center gap-4 pt-4">
                {socialLinksLoading ? (
                    <div className="flex gap-4"><Skeleton className="w-5 h-5" /><Skeleton className="w-5 h-5" /><Skeleton className="w-5 h-5" /></div>
                ) : (
                    socialLinks.map(link => {
                        const Icon = (LucideIcons as any)[link.iconName];
                        const isMail = link.platform === 'Mail';
                        const href = isMail ? `mailto:${link.url}` : link.url;
                        return (
                            <a 
                                key={link.id} 
                                href={href} 
                                target={isMail ? '_self' : '_blank'} 
                                rel={isMail ? '' : 'noopener noreferrer'} 
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                {Icon ? <Icon className="w-5 h-5" /> : null}
                            </a>
                        );
                    })
                )}
                </div>
            </div>

            <FooterLinkColumn title="Legal" links={footerLinks.legal} isLoading={footerLinksLoading} />
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/50 font-medium">
            <p>© {new Date().getFullYear()} TECH KURUKSHETRA Festival. All rights reserved.</p>
            <p className="tracking-widest uppercase">TECH KURUKSHETRA Edition 2026</p>
            </div>
        </footer>
    );
}
