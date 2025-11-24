import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, ShoppingCart, User, Phone, MessageCircle, Copy, Camera, Users, ArrowLeft, Plus } from 'lucide-react';
import { Course, BookingState, ClassType, CartItem } from '../types';
import { AVAILABLE_HOURS } from '../constants';

interface CourseDetailPanelProps {
  course: Course | null;
  onClose: () => void;
  cartItems: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (courseId: string) => void;
}

type BookingStep = 'booking' | 'form' | 'card' | 'contact';

const PRICE_GROUP = 199;
const PRICE_PRIVATE = 499;

const CourseDetailPanel: React.FC<CourseDetailPanelProps> = ({
  course,
  onClose,
  cartItems,
  onAddToCart,
  onRemoveFromCart
}) => {
  const [step, setStep] = useState<BookingStep>('booking');
  
  // Local state for the CURRENT course being viewed
  const [classType, setClassType] = useState<ClassType>('group');
  const [booking, setBooking] = useState<BookingState>({ date: '', time: '' });
  
  // Global form state (one time entry for the whole order)
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', wechat: '' });
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Check if current course is already in cart
  const existingCartItem = course ? cartItems.find(i => i.courseId === course.id) : null;

  // Reset state when course changes
  useEffect(() => {
    if (course) {
      setStep('booking');
      // If already in cart, load that config
      if (existingCartItem) {
        setClassType(existingCartItem.classType);
        setBooking({ date: existingCartItem.date, time: existingCartItem.time });
      } else {
        // Default
        setBooking({ date: '', time: '' });
        setClassType('group');
      }
    }
  }, [course, existingCartItem?.courseId]); // Only reset if course ID changes

  if (!course) return null;

  // Helpers
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = getTodayString();

  const handleCopyWechat = () => {
    navigator.clipboard.writeText('ytdjzxx');
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handleAddToCart = () => {
    onAddToCart({
      courseId: course.id,
      courseTitle: course.title,
      courseLevel: course.level,
      classType: classType,
      date: booking.date,
      time: booking.time,
      price: classType === 'group' ? PRICE_GROUP : PRICE_PRIVATE
    });
  };

  // Determine which items to show in Checkout/Card
  // If the user has just configured the current course and clicks "Confirm", we assume they want to include it.
  // The 'cartItems' prop is the source of truth for the checkout list.
  const isCurrentConfigValid = booking.date && booking.time;
  const currentPrice = classType === 'group' ? PRICE_GROUP : PRICE_PRIVATE;

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const isFormValid = userInfo.name && userInfo.phone && userInfo.wechat;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md md:max-w-lg h-full bg-[#0a0a0c] border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#0f0f12]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 text-xs font-bold bg-sci-blue/10 text-sci-blue rounded border border-sci-blue/20">
                {course.level}
              </span>
              {existingCartItem && step === 'booking' && (
                <span className="flex items-center text-xs text-green-400 gap-1 bg-green-900/20 px-2 py-0.5 rounded">
                  <Check size={12} /> 已在清单
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight pr-8">{course.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white absolute right-4 top-4"
          >
            <X size={24} />
          </button>
        </div>

        {/* Dynamic Content based on Step */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
          
          {/* STEP 1: Course Details & Configuration */}
          {step === 'booking' && (
            <div className="p-6 space-y-8">
              {/* Summary */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">课程概述</h3>
                <p className="text-gray-300 leading-relaxed border-l-2 border-sci-pink pl-4 italic">
                  {course.summary}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">详细内容</h3>
                <ul className="space-y-3">
                  {course.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sci-blue shrink-0" />
                      <span className="text-sm md:text-base leading-relaxed opacity-90">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2 pb-6 border-b border-white/5">
                {course.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Booking Configuration */}
              <div className="space-y-6 bg-[#0f0f12] p-4 rounded-xl border border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Check size={18} className="text-sci-pink" />
                    课程配置
                  </h3>
                  <div className="text-right">
                     <span className="text-xs text-gray-500 block">本节价格</span>
                     <span className="text-xl font-bold text-sci-pink">¥{currentPrice}</span>
                  </div>
                </div>

                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setClassType('group')}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                      classType === 'group' 
                        ? 'bg-sci-blue/10 border-sci-blue text-white' 
                        : 'bg-[#151518] border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Users size={16} /> 团体课
                    </div>
                    <div className="text-xs opacity-70">¥199 / 1-2小时</div>
                  </button>

                  <button
                    onClick={() => setClassType('private')}
                    className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                      classType === 'private' 
                        ? 'bg-sci-pink/10 border-sci-pink text-white' 
                        : 'bg-[#151518] border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <User size={16} /> 私教课
                    </div>
                    <div className="text-xs opacity-70">¥499 / 1-2小时</div>
                  </button>
                </div>
                
                {/* Time Selection */}
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-gray-400">
                    请选择日期（仅限今日及以后）与时间（19:00-23:00）
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 block">日期</label>
                      <input 
                        type="date" 
                        min={today}
                        value={booking.date}
                        onChange={(e) => setBooking(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-[#151518] border border-white/10 text-white rounded px-3 py-3 text-sm focus:outline-none focus:border-sci-blue transition-colors cursor-pointer appearance-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-500 block">时间段</label>
                      <select 
                        value={booking.time}
                        onChange={(e) => setBooking(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-[#151518] border border-white/10 text-white rounded px-3 py-3 text-sm focus:outline-none focus:border-sci-blue appearance-none cursor-pointer"
                      >
                        <option value="">请选择</option>
                        {AVAILABLE_HOURS.map(hour => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Checkout List & User Info */}
          {step === 'form' && (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">已选课程清单</h3>
                  <button onClick={() => setStep('booking')} className="text-xs text-sci-blue hover:text-white">
                    返回修改
                  </button>
                </div>
                
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.courseId} className="bg-white/5 rounded-lg p-3 flex justify-between items-center border border-white/5">
                      <div>
                        <div className="font-bold text-sm text-white">{item.courseTitle}</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <span className={`px-1.5 rounded text-[10px] border ${item.classType === 'group' ? 'border-sci-blue/30 text-sci-blue' : 'border-sci-pink/30 text-sci-pink'}`}>
                             {item.classType === 'group' ? '团体课' : '私教课'}
                          </span>
                          <span>{item.date} {item.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">¥{item.price}</div>
                        <button 
                          onClick={() => onRemoveFromCart(item.courseId)}
                          className="text-[10px] text-red-400 hover:text-red-300 mt-1"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  ))}
                  {cartItems.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">清单为空，请先添加课程</div>
                  )}
                </div>
                
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                   <span className="text-gray-400 text-sm">合计金额</span>
                   <span className="text-2xl font-bold text-sci-pink">¥{totalPrice}</span>
                </div>
              </div>

              <div className="h-px bg-white/10 my-4" />

              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white">预留联系信息</h3>
                <p className="text-xs text-gray-400 mt-1">
                  用于生成预约凭证及助教联系
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <User size={14} /> 您的称呼
                  </label>
                  <input
                    type="text"
                    placeholder="例如：星川同学"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#151518] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-sci-pink transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <Phone size={14} /> 手机号码
                  </label>
                  <input
                    type="tel"
                    placeholder="11位手机号"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-[#151518] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-sci-pink transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-400">
                    <MessageCircle size={14} /> 微信号
                  </label>
                  <input
                    type="text"
                    placeholder="用于添加助教"
                    value={userInfo.wechat}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, wechat: e.target.value }))}
                    className="w-full bg-[#151518] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-sci-pink transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Booking Card (Ticket) */}
          {step === 'card' && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                  <Camera size={20} className="text-sci-pink" />
                  请截图保存下方卡片
                </h3>
                <p className="text-xs text-gray-500 mt-1">截图后点击底部按钮进行下一步</p>
              </div>

              {/* The Card */}
              <div className="w-full max-w-sm bg-[#1a1a1e] border-2 border-sci-pink/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.1)] relative">
                {/* Decorative Top */}
                <div className="h-2 bg-gradient-to-r from-sci-blue via-white to-sci-pink" />
                
                <div className="p-6 space-y-6 relative">
                  {/* Watermark-ish bg */}
                  <div className="absolute top-10 right-[-20px] text-[80px] font-bold text-white/5 rotate-12 pointer-events-none select-none">
                    ORDER
                  </div>

                  <div className="text-center border-b border-dashed border-white/10 pb-6">
                    <div className="inline-block px-3 py-1 bg-white/5 rounded text-xs text-gray-400 tracking-widest mb-2">
                      COURSE RESERVATION
                    </div>
                    <h2 className="text-xl font-bold text-white">星川 AI 专业课预约单</h2>
                    <div className="text-sci-blue font-mono mt-1 text-sm">{getTodayString()}</div>
                  </div>

                  {/* Course List in Ticket */}
                  <div className="space-y-3 text-sm max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                     <div className="text-gray-500 text-xs mb-2">已购课程 ({cartItems.length})</div>
                     {cartItems.map((item, idx) => (
                        <div key={idx} className="bg-black/20 p-2 rounded border border-white/5">
                           <div className="flex justify-between font-bold text-white">
                              <span>{item.courseTitle}</span>
                              <span>¥{item.price}</span>
                           </div>
                           <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>{item.classType === 'group' ? '团体课' : '私教课'} | {item.courseLevel}</span>
                              <span>{item.date} {item.time}</span>
                           </div>
                        </div>
                     ))}
                     
                     <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
                        <span className="text-gray-400">总计</span>
                        <span className="text-sci-pink font-bold">¥{totalPrice}</span>
                     </div>
                  </div>

                  <div className="h-px bg-white/5 my-2" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">学员姓名</span>
                      <span className="text-white font-medium text-right">{userInfo.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">手机号码</span>
                      <span className="text-white font-mono font-bold text-right">{userInfo.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">微信号</span>
                      <span className="text-white font-medium text-right">{userInfo.wechat}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                     {/* Barcode simulation */}
                     <div className="flex items-end h-8 gap-[2px] opacity-50">
                        {[...Array(20)].map((_,i) => (
                          <div key={i} className={`w-[2px] bg-white ${Math.random() > 0.5 ? 'h-full' : 'h-2/3'}`} />
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Contact Assistant */}
          {step === 'contact' && (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20 mb-4">
                <Check size={40} />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">预约成功</h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  请添加小助理微信，并发送刚才的<br/>
                  <span className="text-white font-bold">预约卡片截图</span>
                </p>
              </div>

              <div className="w-full max-w-xs bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">助教微信号</div>
                <div className="text-2xl font-mono font-bold text-sci-pink mb-4 select-all">
                  ytdjzxx
                </div>
                <button 
                  onClick={handleCopyWechat}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded flex items-center justify-center gap-2 transition-colors text-sm font-medium"
                >
                  {showCopyToast ? <Check size={16} /> : <Copy size={16} />}
                  {showCopyToast ? '已复制' : '复制微信号'}
                </button>
              </div>

              <div className="text-xs text-gray-600">
                添加时请备注：报名 {cartItems.map(i => i.courseLevel).join('+')}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#0a0a0c] border-t border-white/10 space-y-4">
          
          {step === 'booking' && (
            <div className="space-y-3">
               {/* Two Buttons: Add & Continue, OR Confirm & Checkout */}
               <div className="flex gap-3">
                  <button
                    disabled={!isCurrentConfigValid}
                    onClick={() => {
                       handleAddToCart();
                       // Optionally show toast or visual feedback here
                    }}
                    className={`flex-1 py-3 rounded font-bold transition-all flex items-center justify-center gap-2 ${
                      !isCurrentConfigValid
                        ? 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {existingCartItem ? '更新配置' : '加入预约单'}
                  </button>
                  
                  <button
                     onClick={onClose}
                     className="px-4 py-3 bg-transparent border border-white/10 text-gray-400 rounded hover:text-white hover:bg-white/5 font-medium text-sm whitespace-nowrap"
                  >
                     继续选课
                  </button>
               </div>
               
               <button
                // Valid if cart has items OR current config is valid (which we will auto-add)
                disabled={cartItems.length === 0 && !isCurrentConfigValid}
                onClick={() => {
                   if (isCurrentConfigValid) {
                      handleAddToCart();
                   }
                   setStep('form');
                }}
                className={`w-full py-3.5 rounded font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                   (cartItems.length === 0 && !isCurrentConfigValid)
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sci-pink to-purple-600 text-white shadow-lg shadow-sci-pink/20 hover:shadow-sci-pink/40 hover:-translate-y-0.5'
                }`}
              >
                <ShoppingCart size={18} />
                去结算 {cartItems.length > 0 && isCurrentConfigValid ? `(${cartItems.length + (existingCartItem ? 0 : 1)})` : cartItems.length > 0 ? `(${cartItems.length})` : ''}
              </button>
            </div>
          )}

          {step === 'form' && (
            <div className="flex gap-3">
               <button
                onClick={() => setStep('booking')}
                className="px-4 py-3 rounded font-bold bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                disabled={!isFormValid || cartItems.length === 0}
                onClick={() => setStep('card')}
                className={`flex-1 py-3 rounded font-bold tracking-wide transition-all duration-300 ${
                  (!isFormValid || cartItems.length === 0)
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sci-pink to-purple-600 text-white shadow-lg shadow-sci-pink/20'
                }`}
              >
                生成预约卡片
              </button>
            </div>
          )}

          {step === 'card' && (
            <div className="flex gap-3">
              <button
                onClick={() => setStep('form')}
                className="px-4 py-3 rounded font-bold bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
              >
                修改信息
              </button>
              <button
                onClick={() => setStep('contact')}
                className="flex-1 py-3 rounded font-bold tracking-wide bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} />
                已截图，下一步
              </button>
            </div>
          )}

          {step === 'contact' && (
             <button
                onClick={onClose}
                className="w-full py-3.5 rounded font-bold tracking-wide bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                完成
              </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default CourseDetailPanel;