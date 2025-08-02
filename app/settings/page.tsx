import React from "react";
/**

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:grid-cols-6 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div>
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Avatar
                  </Button>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Jane Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="janedoe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" defaultValue="Digital storyteller and NFT enthusiast" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" defaultValue="https://janedoe.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="San Francisco, CA" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred-genres">Preferred Genres</Label>
                <Select defaultValue="sci-fi">
                  <SelectTrigger id="preferred-genres">
                    <SelectValue placeholder="Select preferred genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sci-fi">Science Fiction</SelectItem>
                    <SelectItem value="fantasy">Fantasy</SelectItem>
                    <SelectItem value="mystery">Mystery</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="horror">Horror</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account credentials and security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Login Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts when someone logs into your account</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button>Update Account</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Story Comments</h4>
                    <p className="text-sm text-muted-foreground">When someone comments on your stories</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">New Followers</h4>
                    <p className="text-sm text-muted-foreground">When someone follows your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Story Likes</h4>
                    <p className="text-sm text-muted-foreground">When someone likes your stories</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">NFT Purchases</h4>
                    <p className="text-sm text-muted-foreground">When someone purchases your NFT stories</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Platform Updates</h4>
                    <p className="text-sm text-muted-foreground">News and updates about GroqTales</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground">Promotions and marketing messages</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Settings</CardTitle>
              <CardDescription>Manage your crypto wallet and NFT preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Connected Wallet Address</Label>
                  <div className="flex">
                    <Input id="wallet-address" defaultValue="0x1a2b3c4d5e6f7g8h9i0j..." readOnly className="flex-1" />
                    <Button variant="outline" className="ml-2">Disconnect</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network">Preferred Network</Label>
                  <Select defaultValue="ethereum">
                    <SelectTrigger id="network">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="avalanche">Avalanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Show NFT Badge on Stories</h4>
                    <p className="text-sm text-muted-foreground">Display NFT ownership badge on your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-mint Popular Stories</h4>
                    <p className="text-sm text-muted-foreground">Automatically create NFTs for stories that reach popularity thresholds</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button>Save Wallet Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how GroqTales looks for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start">
                      <span className="w-4 h-4 rounded-full bg-white border mr-2"></span>
                      Light
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="w-4 h-4 rounded-full bg-slate-950 mr-2"></span>
                      Dark
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <span className="w-4 h-4 rounded-full bg-gradient-to-r from-slate-100 to-slate-950 mr-2"></span>
                      System
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="font-size">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="x-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Reduce Animations</h4>
                    <p className="text-sm text-muted-foreground">Minimize motion effects throughout the interface</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button>Save Appearance Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your data and privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Profile Visibility</h4>
                    <p className="text-sm text-muted-foreground">Who can see your profile</p>
                  </div>
                  <Select defaultValue="public">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Story Comments</h4>
                    <p className="text-sm text-muted-foreground">Who can comment on your stories</p>
                  </div>
                  <Select defaultValue="everyone">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="nobody">Nobody</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Collection</h4>
                    <p className="text-sm text-muted-foreground">Allow analytics to improve your experience</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Personalized Recommendations</h4>
                    <p className="text-sm text-muted-foreground">Show content based on your interests</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Data Management</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Download Your Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-700">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}