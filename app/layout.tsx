import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '拾页 · 学习手记', description: '学习笔记、实践记录与日常随笔。把学到的，变成自己的。' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="zh-CN"><body>{children}</body></html>; }
