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
import { AppDispatch } from "@/store";
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
import { FiArrowLeft, FiEye, FiShare2 } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addComment,
  getSnippet,
  toggleLikeSnippet,
} from "@/store/slices/snippetSlice";
import LoadingSnipper from "@/components/LoadingSnipper";
import { Textarea } from "@/components/ui/textarea";

const SnippetDetailPage = () => {
  const { currentSnippet, isLoading, error } = useSelector(
    (state: any) => state.snippet
  );
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState("code");
  const [snippet, setSnippet] = useState<any>({});
  const [isLiked, setIsLiked] = useState<Boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [isSaved, setIsSaved] = useState<Boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const { id: snippetID } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    if (snippetID) {
      dispatch(getSnippet(snippetID));
    }
  }, [dispatch, snippetID]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      return;
    }
    if (!currentSnippet) return;

    try {
      await dispatch(toggleLikeSnippet(currentSnippet._id));
      showToast(
        !currentSnippet.isLiked
          ? "You've liked this snippet"
          : "You've removed your like from this snippet",
        "success"
      );
    } catch (error: any) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = () => {
    const updatedIsSaved = !isSaved;
    setIsSaved(updatedIsSaved);

    showToast(
      updatedIsSaved
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
    if (currentSnippet?.code) {
      window.navigator.clipboard.writeText(currentSnippet.content);

      showToast(
        "The snippet code has been copied to your clipboard",
        "success"
      );
    }
  };

  const handleAddComment = async () => {
    console.log("entered!");
    if (!isAuthenticated) return;
    if (!newComment.trim() || !snippetID) return;

    setIsAddingComment(true);

    try {
      const result = await dispatch(
        addComment({ snippetID, content: newComment.trim() })
      );

      if (addComment.fulfilled.match(result)) {
        setNewComment("");
        await dispatch(getSnippet(snippetID));
      }
    } catch (error: any) {
      console.error("Error adding comment:", error);
    } finally {
      setIsAddingComment(false);
    }
  };

  console.log(currentSnippet);

  // if (isLoading) {
  //   return <LoadingSnipper>Loading snippet details...</LoadingSnipper>;
  // }

  if (!currentSnippet) {
    return (
      <p className="text-center text-muted-foreground py-6">
        Snippet not found
      </p>
    );
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
                    <CardTitle className="text-2xl">
                      {currentSnippet.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {currentSnippet.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleLike}>
                      {currentSnippet.isLiked ? (
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
                    {currentSnippet.language}
                  </Badge>
                  {currentSnippet.tags?.map((tag: string) => (
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
                    Comments ({currentSnippet.comments?.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FaCode className="size-4 mr-1" />
                      <span>{currentSnippet.language}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                      <MdContentCopy className="size-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto ">
                    <code>{currentSnippet?.code}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="comments" className="pt-4">
                  <div className="space-y-4 last:mb-4">
                    {isAuthenticated && user ? (
                      <div className="border rounded-md p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="size-8">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={user.name}
                            />
                            <AvatarFallback>
                              {user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              rows={3}
                            />
                            <div className="flex justify-end">
                              <Button
                                onClick={handleAddComment}
                                disabled={!newComment.trim() || isAddingComment}
                                size="sm"
                              >
                                {isAddingComment ? "Adding..." : "Add Comment"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-md p-4 text-center">
                        <p className="text-muted-foreground mb-2">
                          Please log in to add comments
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/login")}
                        >
                          Log In
                        </Button>
                      </div>
                    )}
                    {currentSnippet?.comments?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-6">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      currentSnippet.comments.map((comment: any) => (
                        <div
                          key={comment._id}
                          className="border rounded-md p-4"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="size-8">
                              <AvatarImage
                                src={comment.user?.avatar || "/placeholder.svg"}
                                alt={comment.user?.name}
                              />
                              <AvatarFallback>
                                {comment.user?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <p className="font-medium">
                                  {comment.user?.name || "Anonymous"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(comment.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">
                                {comment.content}
                              </p>
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
                    <span>{currentSnippet?.likeCount || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRegCommentAlt className="size-4 mr-1" />
                    <span>{currentSnippet.comments.length || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <FiEye className="size-4 mr-1" />
                    <span>{currentSnippet.viewCount || 0}</span>
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
                      src={currentSnippet?.author?.avatar}
                      alt={currentSnippet?.author?.name}
                    />
                    <AvatarFallback>
                      {currentSnippet?.owner?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentSnippet?.owner?.name}</p>
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
                    <span className="text-sm">{currentSnippet.likeCount}</span>
                  </div>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <FaRegCommentAlt className="size-4 text-muted-foreground mr-2" />
                    <span>Comments</span>
                  </div>
                  <div>
                    <span className="text-sm">
                      {currentSnippet.comments.length}
                    </span>
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
                  {currentSnippet?.tags?.map((tag: string) => (
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
