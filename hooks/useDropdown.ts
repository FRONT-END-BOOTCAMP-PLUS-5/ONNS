import { useState, useRef, useEffect } from 'react';

function useDropdown<T>(defaultValue: T) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T>(defaultValue);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return { isOpen, setIsOpen, selected, setSelected, ref };
}

export default useDropdown;
