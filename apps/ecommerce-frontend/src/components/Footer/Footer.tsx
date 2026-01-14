"use client";
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Dribbble, Globe } from 'lucide-react';
import { FooterBackgroundGradient, TextHoverEffect } from "../ui/hover-footer";
import XSafeLogo from "../ui/XSafeLogo";
import { useScene } from "../../context";
import { OlympiaFooter } from "../footer/OlympiaFooter";

export default function Footer() {
    const { activeCategory } = useScene(); // Get dynamic color

    return (
        <footer className="relative bg-neutral-950 text-white overflow-hidden border-t border-gray-800/50">
            <FooterBackgroundGradient />

            {/* Texto gigante de fondo - DETRÁS DE TODO */}
            <div className="absolute inset-0 flex items-center justify-center z-0 opacity-[0.15] pointer-events-none overflow-hidden">
                <div className="w-full h-full scale-150 translate-y-1/4">
                    <TextHoverEffect
                        svgPath="/logo_xsafe.svg"
                        duration={0.3}
                        className="w-full h-full"
                    />
                </div>
            </div>

            {/* Contenido del footer - DELANTE */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-16">

                {/* GRID DE 4 COLUMNAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pb-12 items-start text-center">

                    {/* COLUMNA 1: Marca */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-6">
                            <XSafeLogo
                                className="w-auto"
                                style={{ height: '40px', color: 'white' }}
                                primaryColor={activeCategory.colors.primary}
                            />
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed font-body max-w-xs mx-auto">
                            Advanced motorcycle protection systems. Engineered for safety, designed for style.
                        </p>
                    </div>

                    {/* COLUMNA 2: About Us */}
                    <div>
                        <h3 className="text-base font-semibold mb-6 font-headers">About Us</h3>
                        <ul className="space-y-4">
                            {['Company History', 'Meet the Team', 'Employee Handbook', 'Careers'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-neutral-400 hover:text-white transition-colors text-xs font-body">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMNA 3: Helpful Links */}
                    <div>
                        <h3 className="text-base font-semibold mb-6 font-headers">Helpful Links</h3>
                        <ul className="space-y-4">
                            {['FAQs', 'Support', 'Live Chat'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-neutral-400 hover:text-white transition-colors text-xs font-body">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMNA 4: Contact Us */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-base font-semibold mb-6 font-headers">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center justify-center gap-3">
                                <Mail className="w-6 h-6 text-[#FF4D4D] flex-shrink-0" />
                                <a href="mailto:contact@xsafe.com" className="text-neutral-400 hover:text-white transition-colors text-xs font-body">
                                    contact@xsafe.com
                                </a>
                            </li>
                            <li className="flex items-center justify-center gap-3">
                                <Phone className="w-6 h-6 text-[#FF4D4D] flex-shrink-0" />
                                <a href="tel:+1800XSAFE99" className="text-neutral-400 hover:text-white transition-colors text-xs font-body">
                                    +1 800 XSAFE 99
                                </a>
                            </li>
                            <li className="flex items-center justify-center gap-3">
                                <MapPin className="w-6 h-6 text-[#FF4D4D] flex-shrink-0" />
                                <span className="text-neutral-400 text-xs font-body">
                                    Santiago, Chile
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Línea separadora */}
                <div className="border-t border-neutral-800 my-10"></div>

                {/* Sección inferior */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                    {/* Redes sociales */}
                    <div className="flex items-center gap-8 text-neutral-400">
                        <a href="#" className="hover:text-white transition-colors"><Facebook className="w-6 h-6" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Instagram className="w-6 h-6" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Twitter className="w-6 h-6" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Dribbble className="w-6 h-6" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Globe className="w-6 h-6" /></a>
                    </div>

                    {/* Copyright */}
                    <p className="text-neutral-400 text-xs font-body">
                        &copy; {new Date().getFullYear()} XSAFE. All rights reserved.
                    </p>
                </div>

                {/* OLYMPIA FOOTER INTEGRATION */}
                <div className="mt-8 pt-8 border-t border-gray-800/30 w-full flex justify-center">
                    <OlympiaFooter variant="minimal" clientCopyright="xSafe ERP" year={2024} />
                </div>
            </div>
        </footer>
    );
}
