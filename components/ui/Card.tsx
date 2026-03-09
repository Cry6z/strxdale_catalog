import Image from 'next/image';
import Link from 'next/link';

interface CatalogItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
}

export default function Card(item: CatalogItem) {
    return (
        <Link href={`/collection/${item.id}`} className="group snap-start cursor-pointer transition-all duration-300 block">
            <div className="aspect-[4/5] overflow-hidden bg-beige relative rounded-2xl md:rounded-none">
                <Image
                    src={item.image_url || '/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/5 transition-colors" />
            </div>

            <div className="mt-4 md:mt-6 flex justify-between items-baseline px-1 md:px-0">
                <div>
                    <h4 className="text-base md:text-lg font-serif font-bold group-hover:text-charcoal/60 transition-colors uppercase tracking-tight">
                        {item.name}
                    </h4>
                    <p className="text-[11px] md:text-sm text-charcoal/50 font-sans tracking-wide">
                        {item.category}
                    </p>
                </div>
                <span className="text-sm md:text-base font-medium font-sans">
                    {item.price === 0 ? (
                        <span className="text-charcoal/40 italic font-medium lowercase">pre order</span>
                    ) : (
                        `$${item.price.toLocaleString()}`
                    )}
                </span>
            </div>
        </Link>
    );
}
