import { Button } from "./ui/button";

interface propsPagination {
  onHandlePreviousPage: () => void;
  currentPage: number;
  totalPages: number;
  onHandleNextPage: () => void;
}

const Pagination = ({
  onHandlePreviousPage,
  currentPage,
  totalPages,
  onHandleNextPage,
}: propsPagination) => {
  const handlePreviousPage = () => {
    onHandlePreviousPage();
  };
  const handleNextPage = () => {
    onHandleNextPage();
  };

  return (
    <div className="flex justify-between items-center mt-6 w-full">
      <Button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>
      <span>
        page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
