import { WhatsAppIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { List, MessageSquarePlus, MessageSquareText, PhoneCall, UserRound } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import type { ActiveDesign } from '../../../types';

interface TabItem {
    key: ActiveDesign;
    label: string;
    accent: string;
}

interface DesignTabsProps {
    activeDesign: ActiveDesign;
    tabItems: readonly TabItem[];
    onSelect: (design: ActiveDesign) => void;
    conversationsCount: number;
    onOpenConversationModal: () => void;
    onOpenConversationsListModal: () => void;
}

type DesignIcon = ComponentType<SVGProps<SVGSVGElement>>;

const designIcons: Record<ActiveDesign, DesignIcon> = {
    whatsapp: WhatsAppIcon,
    sms: MessageSquareText,
    llamada: PhoneCall,
};

// Componente que renderiza las pestanas para cambiar de canal.
export function DesignTabs({
    activeDesign,
    tabItems,
    onSelect,
    conversationsCount,
    onOpenConversationModal,
    onOpenConversationsListModal,
}: DesignTabsProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="border-b border-slate-100 bg-white px-2 py-2">
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                    {tabItems.map((t) => {
                        const active = activeDesign === t.key;
                        const Icon = designIcons[t.key];

                        return (
                            <button
                                key={t.key}
                                id={t.key}
                                type="button"
                                onClick={() => onSelect(t.key)}
                                aria-label={t.label}
                                aria-pressed={active}
                                title={t.label}
                                className={[
                                    'group relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-xs font-semibold',
                                    'transition-colors select-none',
                                    active ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                                    'focus:ring-2 focus:ring-slate-900/20 focus:outline-none',
                                ].join(' ')}
                            >
                                <Icon className="h-4 w-4" aria-hidden="true" />
                            </button>
                        );
                    })}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <span className="mr-1 text-[10px] whitespace-nowrap text-slate-500" role="status" aria-atomic="true">
                        Conversaciones: <b>{conversationsCount}</b>
                    </span>
                    <button
                        id="button-nueva-conversacion"
                        type="button"
                        onClick={onOpenConversationModal}
                        aria-label="Nueva conversación"
                        title="Nueva conversación"
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
                    >
                        <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                        id="button-ver-conversaciones"
                        type="button"
                        onClick={onOpenConversationsListModal}
                        aria-label="Ver conversaciones"
                        title="Ver conversaciones"
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-slate-900/20 focus:outline-none"
                    >
                        <List className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                id="button-perfil"
                                type="button"
                                variant="default"
                                size="icon"
                                aria-label="Abrir menú de perfil"
                                title="Perfil"
                                className="h-8 w-8 cursor-pointer rounded-md border border-slate-300 bg-white p-0 text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <UserRound className="size-4" aria-hidden="true" />
                                <span className="sr-only">Perfil</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
