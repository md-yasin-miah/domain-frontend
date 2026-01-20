import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import CustomTooltip from './CustomTooltip';

interface CopyToClipboardProps {
  children: React.ReactNode;
  textToCopy: string;
  className?: string;
  showIcon?: boolean;
  variant?: 'default' | 'ghost' | 'outline' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const CopyToClipboard = ({
  children,
  textToCopy,
  className,
  showIcon = true,
  variant = 'ghost',
  size = 'icon',
}: CopyToClipboardProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({
        title: t('common.copied') || 'Copied!',
        description: t('common.copied_to_clipboard') || 'Text copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: t('common.error') || 'Error',
        description: t('common.copy_failed') || 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1">{children}</div>
      {showIcon && (
        <CustomTooltip
          content={copied ? (t('common.copied') || 'Copied!') : (t('common.copy') || 'Copy to clipboard')}
        >
          <Button
            variant={variant}
            size={size}
            onClick={handleCopy}
            className="h-6 w-6 p-0 hover:bg-muted/50 shrink-0"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </CustomTooltip>
      )}
    </div>
  );
};
