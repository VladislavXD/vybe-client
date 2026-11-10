import { Button } from "@/components/ui/button";
import Image from "next/image";


export function generateStaticParams(){ 
  return [
    {locale: 'ru'},
    {locale: 'en'}
  ]
}


export default function Home() {
  return (
   <>

   </>
  );
}
