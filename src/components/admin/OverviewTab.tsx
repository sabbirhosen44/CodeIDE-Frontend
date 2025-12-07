import { FaCode, FaLayerGroup, FaUserCircle } from "react-icons/fa";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { getAdminStats } from "@/store/slices/adminSlice";
import { useToast } from "@/hooks/use-toast";

const OverviewTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats: adminStats, isLoading: adminStatsLoading } = useSelector(
    (state: RootState) => state.admin
  );
  const showToast = useToast();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        await dispatch(getAdminStats()).unwrap();
      } catch (error: any) {
        showToast(`${error}`, "error");
      }
    };
    fetchAdminStats();
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaUserCircle className="size-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {adminStatsLoading ? "..." : adminStats?.totalUsers || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaLayerGroup className="size-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {adminStatsLoading ? "..." : adminStats?.totalProjects || 0}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Templates & Snippets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FaCode className="size-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {adminStatsLoading
                  ? "..."
                  : (adminStats?.totalTemplates || 0) +
                    (adminStats?.totalSnippets || 0)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={adminStats?.userGrowth || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Growth</CardTitle>
            <CardDescription>Monthly project creation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={adminStats?.projectGrowth || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projects" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
