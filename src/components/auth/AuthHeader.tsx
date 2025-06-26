
interface AuthHeaderProps {
  title: string;
  description: string;
}

const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <img
        src="/lovable-uploads/98e62fe8-89f3-4c17-82c9-a872ff6e2d36.png"
        alt="Excel Medical Billing"
        className="h-12 w-auto mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default AuthHeader;
