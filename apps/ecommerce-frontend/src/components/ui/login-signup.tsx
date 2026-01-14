"use client";

import * as React from "react";
import { useRef, useEffect, useState } from "react";
import {
    Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Tabs, TabsList, TabsTrigger, TabsContent,
} from "@/components/ui/tabs";
import {
    Eye, EyeOff, Github, Chrome, Mail, Lock, User, ArrowRight, Facebook, Instagram, Linkedin, Twitter,
} from "lucide-react";

const TikTok = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        className={className}
    >
        <path d="M19.589 6.686a3 3 0 0 0-2.875-1.927v-3.72c0 .02-.001.04-.001.06 0 2.72-2.227 4.908-4.947 4.908h-.42V10.74h.42c.866 0 1.666-.24 2.355-.656v5.972C14.12 18.73 11.91 20.9 9.17 20.9 6.27 20.9 3.92 18.57 3.92 15.7c0-2.87 2.35-5.2 5.25-5.2.35 0 .69.04 1.02.12v-3.8c-.34-.06-.68-.1-1.02-.1C4.09 6.72 0 10.76 0 15.7c0 4.94 4.09 8.97 9.17 8.97 4.95 0 9.04-3.92 9.04-8.83v-6.32c1.3.9 2.85 1.44 4.54 1.44v-3.79c-.64 0-1.26-.17-1.81-.48z" />
    </svg>
);

export default function TabAuthSection() {
    const [showLoginPw, setShowLoginPw] = useState(false);
    const [showSignupPw, setShowSignupPw] = useState(false);

    // subtle monochrome particles (optional)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        setSize();

        type P = { x: number; y: number; v: number; o: number };
        let ps: P[] = [];
        let raf = 0;

        const make = (): P => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            v: Math.random() * 0.25 + 0.05,
            o: Math.random() * 0.35 + 0.15,
        });

        const init = () => {
            ps = [];
            const count = Math.floor((canvas.width * canvas.height) / 9000);
            for (let i = 0; i < count; i++) ps.push(make());
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ps.forEach((p) => {
                p.y -= p.v;
                if (p.y < 0) {
                    p.x = Math.random() * canvas.width;
                    p.y = canvas.height + Math.random() * 40;
                    p.v = Math.random() * 0.25 + 0.05;
                    p.o = Math.random() * 0.35 + 0.15;
                }
                ctx.fillStyle = `rgba(250,250,250,${p.o})`;
                ctx.fillRect(p.x, p.y, 0.7, 2.2);
            });
            raf = requestAnimationFrame(draw);
        };

        const onResize = () => { setSize(); init(); };

        window.addEventListener("resize", onResize);
        init();
        raf = requestAnimationFrame(draw);
        return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
    }, []);

    return (
        <section className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center text-zinc-50 z-20 py-12">
            <style>{`
        /* card fade-up on mount */
        .card-animate { opacity: 0; transform: translateY(12px); animation: fadeUp .6s ease .25s forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

        /* --- SIMPLE BLUR SWITCH --- */
        /* Обёртка, чтобы высота карточки не прыгала; подстрой по контенту */
        .tab-shell{ position:relative; min-height: 420px; }

        /* Панели держим смонтированными, переключаем состояниями.
           Неактивная: абсолютная, невидимая, блюр + отключены события.
           Активная: обычная, плавное проявление. */
        .tab-panel{
          transition: opacity .22s ease, filter .22s ease;
        }
        .tab-panel[data-state="inactive"]{
          position:absolute; inset:0;
          opacity:0; filter: blur(8px);
          pointer-events:none;
        }
        .tab-panel[data-state="active"]{
          position:relative;
          opacity:1; filter: blur(0px);
        }

        /* tabs UI tweaks */
        .auth-tabs [role="tablist"] {
          background: #0f0f10; border: 1px solid #27272a; border-radius: 10px; padding: 4px;
        }
        .auth-tabs [role="tab"] {
          font-size: 13px; letter-spacing: .02em;
        }
        .auth-tabs [role="tab"][data-state="active"] {
          background: #111113; border-radius: 8px; box-shadow: inset 0 0 0 1px #27272a;
        }
      `}</style>

            {/* particles */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none" />

            {/* centered card with tabs */}
            <div className="w-full grid place-items-center px-4">
                <Card className="card-animate w-full max-w-md border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Welcome</CardTitle>
                        <CardDescription className="text-zinc-400">Log in or create an account</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="login" className="auth-tabs w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Log In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            {/* shell удерживает высоту; панели поверх друг друга */}
                            <div className="tab-shell mt-6">
                                {/* LOGIN */}
                                <TabsContent value="login" forceMount className="tab-panel space-y-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="login-email" className="text-zinc-300">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="login-password" className="text-zinc-300">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                id="login-password"
                                                type={showLoginPw ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 h-11 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                                                onClick={() => setShowLoginPw((v) => !v)}
                                                aria-label={showLoginPw ? "Hide password" : "Show password"}
                                            >
                                                {showLoginPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="remember" className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900" />
                                            <Label htmlFor="remember" className="text-zinc-400">Remember me</Label>
                                        </div>
                                        <a href="#" className="text-sm text-zinc-300 hover:text-zinc-100">Forgot password?</a>
                                    </div>

                                    <Button className="w-full h-11 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 mt-2 text-base">
                                        Continue
                                    </Button>

                                    <div className="relative py-6">
                                        <Separator className="bg-zinc-800" />
                                        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-zinc-950 px-2 text-[11px] uppercase tracking-widest text-zinc-500">or continue with</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Chrome className="h-5 w-5" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Facebook className="h-5 w-5 text-blue-500" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Instagram className="h-5 w-5 text-pink-500" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Twitter className="h-5 w-5 text-sky-500" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Linkedin className="h-5 w-5 text-blue-400" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <TikTok className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* SIGN UP */}
                                <TabsContent value="signup" forceMount className="tab-panel space-y-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="signup-email" className="text-zinc-300">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="pl-10 h-11 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <Label htmlFor="signup-password" className="text-zinc-300">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                id="signup-password"
                                                type={showSignupPw ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 h-11 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                                                onClick={() => setShowSignupPw((v) => !v)}
                                                aria-label={showSignupPw ? "Hide password" : "Show password"}
                                            >
                                                {showSignupPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox id="terms" className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900" />
                                        <Label htmlFor="terms" className="text-zinc-400 text-sm">I agree to the Terms & Privacy</Label>
                                    </div>

                                    <Button className="w-full h-11 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200 mt-2 text-base">Create account</Button>

                                    <div className="relative py-6">
                                        <Separator className="bg-zinc-800" />
                                        <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-zinc-950 px-2 text-[11px] uppercase tracking-widest text-zinc-500">or continue with</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Chrome className="h-5 w-5" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Facebook className="h-5 w-5 text-blue-500" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Instagram className="h-5 w-5 text-pink-500" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Twitter className="h-5 w-5 text-sky-500" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <Linkedin className="h-5 w-5 text-blue-400" />
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-11 w-full rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-800">
                                            <TikTok className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="flex items-center justify-center text-sm text-zinc-400">
                        Need help? <a className="ml-1 text-zinc-200 hover:underline" href="#">Contact support</a>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}
