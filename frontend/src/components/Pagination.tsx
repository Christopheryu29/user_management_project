import React from "react";
import { HStack, Button, Text, IconButton } from "@chakra-ui/react";
// Using emoji icons

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <HStack gap={2} justify="center" my={8}>
      <IconButton
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        bg="white"
        borderColor="gray.200"
        size="sm"
      >
        ←
      </IconButton>

      {currentPage > 3 && (
        <>
          <Button
            onClick={() => onPageChange(1)}
            variant="outline"
            bg="white"
            borderColor="gray.200"
            size="sm"
          >
            1
          </Button>
          {currentPage > 4 && (
            <Text color="gray.500" px={2}>
              ...
            </Text>
          )}
        </>
      )}

      {getPageNumbers().map((pageNumber) => (
        <Button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          variant={currentPage === pageNumber ? "solid" : "outline"}
          bg={currentPage === pageNumber ? "blue.500" : "white"}
          color={currentPage === pageNumber ? "white" : "gray.700"}
          borderColor={currentPage === pageNumber ? "blue.500" : "gray.200"}
          size="sm"
          minW={10}
        >
          {pageNumber}
        </Button>
      ))}

      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && (
            <Text color="gray.500" px={2}>
              ...
            </Text>
          )}
          <Button
            onClick={() => onPageChange(totalPages)}
            variant="outline"
            bg="white"
            borderColor="gray.200"
            size="sm"
          >
            {totalPages}
          </Button>
        </>
      )}

      <IconButton
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        bg="white"
        borderColor="gray.200"
        size="sm"
      >
        →
      </IconButton>
    </HStack>
  );
};

export default Pagination;