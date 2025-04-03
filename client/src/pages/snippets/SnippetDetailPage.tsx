import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { MOCK_SNIPPETS } from "@/mockdata";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import {
  FaBookmark,
  FaCode,
  FaHeart,
  FaRegBookmark,
  FaRegCommentAlt,
  FaRegHeart,
} from "react-icons/fa";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { useNavigate, useParams } from "react-router-dom";

const SnippetDetailPage = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [snippet, setSnippet] = useState<any>({});
  const [isLiked, setIsLiked] = useState<Boolean>(false);
  const [isSaved, setIsSaved] = useState<Boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const { id: snippetID } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    const foundSnippet = MOCK_SNIPPETS.find(
      (snippet) => snippet.id === snippetID
    );

    if (foundSnippet) {
      setSnippet(foundSnippet);
      setComments(foundSnippet.comments);
    } else {
      navigate("/404");
    }
  }, [snippetID, navigate]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);

    showToast(
      isLiked
        ? "You've removed your like from this snippet"
        : "You've liked this snippet",
      "success"
    );
  };

  const handleSave = () => {
    setIsSaved((prev) => !prev);

    showToast(
      isSaved
        ? "Snippet added to your saved collection"
        : "Snippet removed from your saved collection",
      "success"
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);

    showToast("The snippet link has been copied to your clipboard", "success");
  };

  const handleTabsCategory = () => {
    activeTab === "code" ? setActiveTab("comments") : setActiveTab("code");
  };

  const handleCopyCode = () => {
    window.navigator.clipboard.writeText(snippet.content);

    showToast("The snippet code has been copied to your clipboard", "success");
  };

  if (!snippet) {
    return <div className="container mx-auto py-8 px-4">Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/snippets")}
        >
          <FiArrowLeft className="mr-2 size-4" />
          Back to Snippets
        </Button>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{snippet.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {snippet.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleLike}>
                      {isLiked ? (
                        <FaHeart className="size-4 text-red-500 " />
                      ) : (
                        <FaRegHeart className="size-4 " />
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleSave}>
                      {isSaved ? (
                        <FaBookmark className="size-4 text-primary" />
                      ) : (
                        <FaRegBookmark className="size-4 " />
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                      <FiShare2 className={`size-4`} />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge className="cursor-pointer" variant="outline">
                    {snippet.language}
                  </Badge>
                  {snippet.tags?.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <Tabs
                value={activeTab}
                onValueChange={handleTabsCategory}
                className="px-6 "
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="comments">
                    Comments ({snippet.comments?.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FaCode className="size-4 mr-1" />
                      <span>{snippet.language}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                      <MdContentCopy className="size-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto ">
                    <code>{snippet?.content}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="comments" className="pt-4">
                  <div className="space-y-4 last:mb-4">
                    {comments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-6">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="border rounded-md p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={comment.author.avatar}
                                alt={comment.author.name}
                              />
                              <AvatarFallback>
                                {comment.author.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <p className="font-medium">
                                  {comment.author.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(comment.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <CardFooter className="border-t flex justify-between py-4">
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <div className="flex items-center">
                    <FaRegHeart className="size-4 mr-1" />
                    <span>{isLiked ? snippet.likes + 1 : snippet.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRegCommentAlt className="size-4 mr-1" />
                    <span>{comments.length}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage
                      src={snippet?.author?.avatar}
                      alt={snippet?.author?.name}
                    />
                    <AvatarFallback>
                      {snippet?.author?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{snippet?.author?.name}</p>
                    <p className="text-sm text-muted-foreground">Author</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Snippet Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <SlCalender className="size-4 text-muted-foreground mr-2" />
                    <span>Created</span>
                  </div>
                  <div>
                    <span className="text-sm">
                      {snippet.createdAt &&
                        formatDistanceToNow(new Date(snippet.createdAt), {
                          addSuffix: true,
                        })}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <FaRegHeart className="size-4 text-muted-foreground mr-2" />
                    <span>Likes</span>
                  </div>
                  <div>
                    <span className="text-sm">
                      {isLiked ? snippet.likes + 1 : snippet.likes}
                    </span>
                  </div>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <FaRegCommentAlt className="size-4 text-muted-foreground mr-2" />
                    <span>Comments</span>
                  </div>
                  <div>
                    <span className="text-sm">{comments.length}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <FaCode className="size-4 text-muted-foreground mr-2" />
                    <span>Language</span>
                  </div>
                  <div>
                    <Badge variant="outline">{snippet.language}</Badge>
                  </div>
                </div>
                <Separator />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {snippet?.tags?.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SnippetDetailPage;
