import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, HeartIcon, EyeIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getGenreBySlug } from '@/components/genre-selector';
import { fetchStoryById } from '@/lib/mock-data';
import StoryCard from '@/components/story-card';
import { Separator } from '@/components/ui/separator';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const story = fetchStoryById(params.id);
  
  if (!story) {
    return {
      title: 'Story Not Found | GroqTales',
    };
  }
  
  return {
    title: `${story.title} | GroqTales`,
    description: `Read "${story.title}" by ${story.author} on GroqTales. ${story.description.substring(0, 150)}...`,
  };
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = fetchStoryById(params.id);
  
  if (!story) {
    return (
      <div className="container mx-auto py-16">
        <Card>
          <CardHeader>
            <CardTitle>Story Not Found</CardTitle>
            <CardDescription>The story you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/nft-gallery">
              <Button>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Gallery
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const genre = getGenreBySlug(story.genre);
  const relatedStories = fetchStoryById(params.id, 4, true);
  
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <div className="flex items-center mb-8">
          <Link href="/nft-gallery">
            <Button variant="ghost">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                <Image 
                  src={story.coverImage} 
                  alt={story.title}
                  fill
                  className="object-cover" 
                  priority
                />
              </div>
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold">{story.title}</CardTitle>
                    <CardDescription className="text-lg">
                      By {story.author} • {new Date().toLocaleDateString()}
                    </CardDescription>
                  </div>
                  
                  <div>
                    {genre && (
                      <Link href={`/genres/${genre.slug}`}>
                        <Badge 
                          className="ml-2" 
                          style={{ 
                            backgroundColor: genre.color + '20', 
                            color: genre.color, 
                            border: `1px solid ${genre.color}`
                          }}
                        >
                          {genre.name}
                        </Badge>
                      </Link>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="prose max-w-none dark:prose-invert">
                  {story.description.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <HeartIcon className="h-4 w-4 mr-2" />
                      {story.likes}
                    </Button>
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      <span>{story.views} views</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${story.author}`} />
                    <AvatarFallback>{story.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{story.author}</h3>
                    <p className="text-sm text-muted-foreground">Author • Creator</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Creative storyteller specializing in {genre?.name || 'various genres'} with a passion for immersive narratives.
                </p>
                <Button variant="outline" className="w-full">Follow Author</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>NFT Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">{story.price} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token ID</span>
                    <span className="font-medium">#{params.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blockchain</span>
                    <span className="font-medium">Ethereum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <Button className="w-full">Purchase NFT</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Stories</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 