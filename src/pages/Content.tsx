import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Search,
  Upload,
  FileText,
  Image,
  Video,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  FolderOpen,
  File,
  MoreHorizontal,
  Link,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  type: "paper" | "presentation" | "poster" | "video" | "document";
  session: string;
  speaker: string;
  uploadedAt: string;
  size: string;
  downloads: number;
  isPublic: boolean;
}

const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "AI in Healthcare: A Comprehensive Review",
    type: "paper",
    session: "Keynote: Future of AI",
    speaker: "Dr. Sarah Chen",
    uploadedAt: "2024-03-10",
    size: "2.4 MB",
    downloads: 156,
    isPublic: true,
  },
  {
    id: "2",
    title: "Workshop Slides - Building Scalable Systems",
    type: "presentation",
    session: "Workshop: Scalability",
    speaker: "Michael Brown",
    uploadedAt: "2024-03-12",
    size: "15.2 MB",
    downloads: 89,
    isPublic: true,
  },
  {
    id: "3",
    title: "Research Poster - ML Applications",
    type: "poster",
    session: "Poster Session A",
    speaker: "Emily Watson",
    uploadedAt: "2024-03-08",
    size: "8.7 MB",
    downloads: 42,
    isPublic: false,
  },
  {
    id: "4",
    title: "Conference Welcome Video",
    type: "video",
    session: "Opening Ceremony",
    speaker: "Conference Team",
    uploadedAt: "2024-03-01",
    size: "245 MB",
    downloads: 312,
    isPublic: true,
  },
];

const typeIcons = {
  paper: FileText,
  presentation: FolderOpen,
  poster: Image,
  video: Video,
  document: File,
};

const typeStyles = {
  paper: "bg-primary/10 text-primary",
  presentation: "bg-secondary/20 text-secondary-foreground",
  poster: "bg-info/10 text-info",
  video: "bg-success/10 text-success",
  document: "bg-muted text-muted-foreground",
};

export default function Content() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredContent = mockContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout
      title="Content Management"
      subtitle="Upload and manage papers, presentations, posters, and media"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">48</p>
                <p className="text-xs text-muted-foreground">Papers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <FolderOpen className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">32</p>
                <p className="text-xs text-muted-foreground">Presentations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Image className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">Posters</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Video className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Download className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2.4K</p>
                <p className="text-xs text-muted-foreground">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Upload className="h-4 w-4" />
          Upload Content
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All Content</TabsTrigger>
          <TabsTrigger value="paper">Papers</TabsTrigger>
          <TabsTrigger value="presentation">Presentations</TabsTrigger>
          <TabsTrigger value="poster">Posters</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContent.map((item, index) => {
          const TypeIcon = typeIcons[item.type];
          return (
            <Card
              key={item.id}
              className="card-elevated overflow-hidden animate-scale-in hover:shadow-lg transition-all duration-200"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={cn("p-2.5 rounded-xl", typeStyles[item.type])}>
                    <TypeIcon className="h-5 w-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem className="gap-2">
                        <Eye className="h-4 w-4" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Download className="h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Link className="h-4 w-4" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-base line-clamp-2 mt-3">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {item.speaker} • {item.session}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </div>
                  <span>{item.size}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-muted text-muted-foreground">
                      {item.downloads} downloads
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`public-${item.id}`} className="text-xs text-muted-foreground">
                      Public
                    </Label>
                    <Switch id={`public-${item.id}`} checked={item.isPublic} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Upload Card */}
        <Card className="card-elevated border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground group-hover:text-primary transition-colors">
            <Plus className="h-10 w-10 mb-3" />
            <p className="font-medium">Upload New Content</p>
            <p className="text-sm">PDF, PPTX, Images, Videos</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
