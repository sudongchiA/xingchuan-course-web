import React, { useState } from 'react';
import { Menu, ShoppingBag, ChevronRight, PlayCircle, Users, User, X } from 'lucide-react';
import { COURSES } from './constants';
import { Course, CartItem } from './types';
import CourseDetailPanel from './components/CourseDetailPanel';

const App: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const selectedCourse = selectedCourseId 
    ? COURSES.find(c => c.id === selectedCourseId) || null 
    : null;

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      // Remove existing item for same course if exists (update logic), or just push?
      // Assumption: A user can only book a specific course once per transaction to avoid duplicates, 
      // or they can book multiple times. Let's allow updating the existing booking for the same course ID.
      const filtered = prev.filter(i => i.courseId !== item.courseId);
      return [...filtered, item];
    });
  };

  const removeFromCart = (courseId: string) => {
    setCartItems(prev => prev.filter(i => i.courseId !== courseId));
  };

  return (
    <div className="min-h-screen bg-sci-black text-white font-sans selection:bg-sci-pink selection:text-white pb-20">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-sci-black/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-sci-pink to-sci-blue rounded-md flex items-center justify-center font-bold text-lg">
                S
              </div>
              <div className="hidden md:block">
                <h1 className="font-bold text-lg tracking-tight">星川的 AI 专业课</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Star River Professional AI</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
              <a href="#hero" className="hover:text-white transition-colors">首页</a>
              <a href="#courses" className="hover:text-white transition-colors">课程总览</a>
              <a href="#about" className="hover:text-white transition-colors">适合人群</a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => {
                  if (cartItems.length > 0) {
                    // If cart has items but no course is selected, maybe open the last added course or a generic cart view?
                    // For now, we rely on the course detail panel to show the cart during checkout.
                    // Let's open the first course in the cart to trigger the panel if closed.
                    const firstId = cartItems[0].courseId;
                    setSelectedCourseId(firstId);
                  }
                }}
              >
                <ShoppingBag size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-sci-pink text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button className="md:hidden p-2 text-gray-400">
                <Menu size={24} />
              </button>
              <button className="hidden md:block bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-medium transition-all border border-white/10">
                咨询助教
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section id="hero" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sci-blue/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-sci-pink/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Visual (Simulated from description) */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-sci-pink to-sci-blue opacity-20 blur-2xl rounded-full transform group-hover:scale-105 transition-transform duration-700"></div>
              {/* Placeholder for "Main Visual Character" - using a techy abstract image */}
              <div className="relative w-full aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm">
                 <img 
                    src="https://picsum.photos/800/800?grayscale&blur=2" 
                    alt="Star River AI Visual" 
                    className="w-full h-full object-cover opacity-60 mix-blend-screen hover:opacity-80 transition-opacity duration-500"
                 />
                 <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="text-sci-blue font-mono text-xs mb-1">AI VIDEO PRODUCTION</div>
                    <div className="text-white font-bold text-xl">系统化学习 · 商业化应用</div>
                 </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sci-pink/10 border border-sci-pink/20 text-sci-pink text-xs font-bold mb-6">
                  <span className="animate-pulse w-2 h-2 bg-sci-pink rounded-full"></span>
                  2025 全新升级
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                  星川的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-sci-blue via-white to-sci-pink">AI 专业课</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-lg">
                  针对需要系统学习 AI 视频制作及商业运用的同学。
                  从认知框架到导演级全流程整合，帮你打通 AI 创作与变现的最后一公里。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-sci-blue mb-2">
                    <Users size={20} />
                    <span className="font-bold">团体课</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">¥199<span className="text-xs text-gray-500 font-normal">/节</span></p>
                  <p className="text-xs text-gray-400">5-10 人成团 | 1-2小时</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-sci-pink mb-2">
                    <User size={20} />
                    <span className="font-bold">私教课</span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">¥499<span className="text-xs text-gray-500 font-normal">/节</span></p>
                  <p className="text-xs text-gray-400">1V1 深度指导 | 1-2小时</p>
                </div>
              </div>

              <div className="pt-4">
                <a href="#courses" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                  浏览课程列表 <ChevronRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Course List Section --- */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">11级课程体系</h2>
            <p className="text-gray-400 text-sm">Level 1 - Level 10 循序渐进</p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-xs text-gray-500 uppercase">Total Modules</div>
            <div className="font-mono text-2xl text-sci-pink">10</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => {
            const inCart = cartItems.some(i => i.courseId === course.id);
            return (
              <div 
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className="group relative bg-[#0f0f12] border border-white/5 rounded-2xl p-6 hover:border-sci-blue/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-sci-blue/10 rounded-full blur-3xl group-hover:bg-sci-blue/20 transition-all duration-500" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-mono text-sm text-sci-blue bg-sci-blue/10 px-2 py-1 rounded">
                      {course.level}
                    </span>
                    {inCart && (
                       <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                         <span className="text-[10px] text-green-400 font-bold">已在清单</span>
                       </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sci-blue transition-colors line-clamp-1">
                    {course.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {course.summary.replace('核心目标：', '')}
                  </p>

                  <button 
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 text-gray-300 text-sm font-medium group-hover:bg-white/10 group-hover:text-white transition-all"
                  >
                    查看课件内容 <PlayCircle size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- CTA / Footer Section --- */}
      <section id="about" className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          适合人群
        </h2>
        <p className="text-gray-400 mb-12 leading-relaxed">
          如果你对 AI 视频制作有着浓厚的兴趣；<br />
          如果你工作中涉及 AIGC 或者有转岗 AI 岗的意向；<br />
          欢迎报名星川的 AI 专业课。专业课将兼顾每一位同学的入门基础和学习进度，<br />
          并按照商业化的目标教学，实现短期内团体及个人共同进步。
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-300">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-sci-pink rounded-full"></span> 深入学习视频制作</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-sci-blue rounded-full"></span> 多平台综合运用</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> 布置和批改作业</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> 产出高质量成片</span>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-gray-600 text-xs">© 2025 Star River AI Professional Course. All rights reserved.</p>
        </div>
      </section>

      {/* --- Detail Panel (Overlay) --- */}
      <CourseDetailPanel 
        course={selectedCourse}
        cartItems={cartItems}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onClose={() => setSelectedCourseId(null)}
      />
    </div>
  );
};

export default App;