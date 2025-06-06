import { Button } from '@/components/ui/button';

const EmptyState = ({ title, description, icon: Icon, action }) => {
  return (
    <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
      {Icon && <Icon className="mx-auto h-12 w-12 text-muted-foreground" />}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;