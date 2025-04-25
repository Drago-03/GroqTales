import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface CreatorCardProps {
  creator: {
    id: string;
    name: string;
    bio: string;
    avatarUrl: string;
    profileUrl: string;
  };
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(creator.profileUrl);
  };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClick}>
      <CardHeader>
        <CardTitle>{creator.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={creator.avatarUrl} alt={creator.name} className="w-24 h-24 rounded-full mb-2" />
        <p className="text-sm text-muted-foreground">{creator.bio}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <Link href={creator.profileUrl}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 