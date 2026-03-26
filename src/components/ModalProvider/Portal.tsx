import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export function Portal({ children }: PortalProps) {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const portalRoot = document.getElementById('portal');
    if (portalRoot) {
      setMountNode(portalRoot);
    } else {
      const div = document.createElement('div');
      div.id = 'portal';
      document.body.appendChild(div);
      setMountNode(div);
    }
  }, []);

  if (!mountNode) return null;

  return createPortal(children, mountNode);
}
