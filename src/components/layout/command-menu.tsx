"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Command } from "cmdk";
import { useTheme } from "next-themes";
import { ArrowUpRight, Copy, Download, Flame, Palette } from "lucide-react";
import { navItems, siteConfig } from "@/lib/site-config";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useToast } from "@/components/ui/toast";

interface CommandMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

export function useCommandMenu(): CommandMenuContextValue {
  const ctx = useContext(CommandMenuContext);
  if (!ctx)
    throw new Error("useCommandMenu must be used within CommandMenuProvider");
  return ctx;
}

export function CommandMenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <CommandMenuContext.Provider value={{ open, setOpen, toggle }}>
      {children}
      <CommandMenu />
    </CommandMenuContext.Provider>
  );
}

function CommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const { setTheme, resolvedTheme } = useTheme();
  const scrollTo = useSmoothScroll();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const showSecret = search.toLowerCase().includes("hades");

  const run = useCallback(
    (action: () => void) => {
      setOpen(false);
      action();
    },
    [setOpen],
  );

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Paleta de comandos"
      shouldFilter
    >
      <Command.Input
        value={search}
        onValueChange={setSearch}
        placeholder="Buscar ou navegar…"
      />
      <Command.List>
        <Command.Empty>Nenhum resultado.</Command.Empty>

        <Command.Group heading="Navegar">
          {navItems.map((item) => (
            <Command.Item
              key={item.id}
              value={`navegar ${item.label.pt}`}
              onSelect={() => run(() => scrollTo(item.href))}
            >
              {item.label.pt}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Ações">
          <Command.Item
            value="copiar email contato"
            onSelect={() =>
              run(() => {
                void navigator.clipboard?.writeText(siteConfig.email);
                toast("E-mail copiado");
              })
            }
          >
            <Copy size={16} strokeWidth={1.5} /> Copiar e-mail
          </Command.Item>
          <Command.Item
            value="baixar cv curriculo"
            onSelect={() => run(() => window.open(siteConfig.cvUrl, "_blank"))}
          >
            <Download size={16} strokeWidth={1.5} /> Baixar CV
          </Command.Item>
          <Command.Item
            value="abrir github"
            onSelect={() =>
              run(() => window.open(siteConfig.links.github, "_blank"))
            }
          >
            <ArrowUpRight size={16} strokeWidth={1.5} /> Abrir GitHub
          </Command.Item>
          <Command.Item
            value="mudar tema claro escuro"
            onSelect={() =>
              run(() => setTheme(resolvedTheme === "light" ? "dark" : "light"))
            }
          >
            <Palette size={16} strokeWidth={1.5} /> Mudar tema
          </Command.Item>
        </Command.Group>

        {showSecret ? (
          <Command.Group heading="Secreto">
            <Command.Item
              value="hades descer ao submundo underworld"
              onSelect={() =>
                run(() => {
                  setTheme("underworld");
                  toast("Você desceu ao submundo.");
                })
              }
            >
              <Flame size={16} strokeWidth={1.5} /> Descer ao submundo
            </Command.Item>
          </Command.Group>
        ) : null}
      </Command.List>
    </Command.Dialog>
  );
}
