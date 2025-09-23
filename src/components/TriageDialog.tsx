import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle } from 'lucide-react';
import { Chat } from '@/types/chat';

interface TriageDialogProps {
  chat: Chat;
  trigger?: React.ReactNode;
}

export const TriageDialog = ({ chat, trigger }: TriageDialogProps) => {
  const hasValidTriage = chat.triage && Object.keys(chat.triage).length > 0;

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <FileText className="h-4 w-4" />
      Triagem
    </Button>
  );

  const renderTriageContent = () => {
    if (!hasValidTriage) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <span>Triagem incompleta</span>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {Object.entries(chat.triage).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
              {key.replace(/_/g, ' ')}
            </h4>
            <p className="text-sm bg-muted p-3 rounded-md">
              {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Triagem da Conversa
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderTriageContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};