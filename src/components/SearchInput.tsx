// Archivo: src/components/SearchInput.tsx

'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Espera 300ms después de que el usuario deja de escribir

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <Input
        className="peer block w-full rounded-md border border-input bg-background py-[9px] pl-4 text-sm outline-2 placeholder:text-muted-foreground"
        placeholder="Search by name..."
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}