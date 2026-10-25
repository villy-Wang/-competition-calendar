import{CalendarDays}from'lucide-react';

export default function ProductBrand({className=''}:{className?:string}){
 return <div className={`product-brand ${className}`} aria-label="竞赛日历 competition calendar">
  <CalendarDays className="product-brand-icon" aria-hidden="true" strokeWidth={1.8}/>
  <span className="product-brand-name"><strong>竞赛日历</strong><small>competition calendar</small></span>
 </div>
}
