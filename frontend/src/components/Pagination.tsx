import React from "react";
import {
  HStack,
  Button,
  Text,
  IconButton,
  VStack,
  Flex,
  Badge,
  Box,
} from "@chakra-ui/react";

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
    <VStack gap={4} align="center" py={6}>
      {/* Modern Page Info */}
      <Box
        bg="white"
        borderRadius="xl"
        p={4}
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <HStack gap={4} align="center">
          <Text
            fontSize="sm"
            color="gray.600"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Page Navigation
          </Text>
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            px={4}
            py={2}
            borderRadius="lg"
            fontWeight="bold"
            fontSize="sm"
            shadow="sm"
          >
            {currentPage} of {totalPages}
          </Box>
        </HStack>
      </Box>

      {/* Modern Navigation Buttons */}
      <Box
        bg="white"
        borderRadius="xl"
        p={3}
        shadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <HStack gap={2} justify="center" wrap="wrap">
          {/* Previous Button */}
          <IconButton
            aria-label="Previous page"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            bg="white"
            borderColor="gray.300"
            borderRadius="lg"
            size="md"
            w="44px"
            h="44px"
            _hover={{
              bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              transform: "translateY(-2px)",
              shadow: "lg",
              borderColor: "transparent",
            }}
            _active={{
              transform: "translateY(0px)",
              shadow: "md",
            }}
            _disabled={{
              opacity: 0.3,
              cursor: "not-allowed",
              _hover: {
                transform: "none",
                shadow: "none",
                bg: "white",
                color: "gray.500",
                borderColor: "gray.300",
              },
            }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <Text fontSize="md" fontWeight="bold">
              ‹
            </Text>
          </IconButton>

          {/* First page + ellipsis */}
          {currentPage > 3 && (
            <>
              <Button
                onClick={() => onPageChange(1)}
                variant="outline"
                bg="white"
                borderColor="gray.300"
                borderRadius="lg"
                size="md"
                w="40px"
                h="40px"
                _hover={{
                  bg: "blue.50",
                  borderColor: "blue.400",
                  transform: "translateY(-1px)",
                  shadow: "md",
                }}
                _active={{
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
                fontWeight="bold"
                fontSize="sm"
              >
                1
              </Button>
              {currentPage > 4 && (
                <Text color="gray.400" px={2} fontSize="lg" fontWeight="bold">
                  •••
                </Text>
              )}
            </>
          )}

          {/* Page Number Buttons */}
          {getPageNumbers().map((pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              variant={currentPage === pageNumber ? "solid" : "outline"}
              bg={
                currentPage === pageNumber
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "white"
              }
              color={currentPage === pageNumber ? "white" : "gray.700"}
              borderColor={
                currentPage === pageNumber ? "transparent" : "gray.300"
              }
              borderRadius="lg"
              size="md"
              w="44px"
              h="44px"
              _hover={
                currentPage === pageNumber
                  ? {
                      bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                      transform: "translateY(-2px)",
                      shadow: "lg",
                    }
                  : {
                      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      borderColor: "transparent",
                      transform: "translateY(-2px)",
                      shadow: "lg",
                    }
              }
              _active={{
                transform: "translateY(0px)",
                shadow: "md",
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              fontWeight="bold"
              fontSize="md"
              shadow={currentPage === pageNumber ? "md" : "none"}
            >
              {pageNumber}
            </Button>
          ))}

          {/* Last page + ellipsis */}
          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <Text color="gray.400" px={2} fontSize="lg" fontWeight="bold">
                  •••
                </Text>
              )}
              <Button
                onClick={() => onPageChange(totalPages)}
                variant="outline"
                bg="white"
                borderColor="gray.300"
                borderRadius="lg"
                size="md"
                w="40px"
                h="40px"
                _hover={{
                  bg: "blue.50",
                  borderColor: "blue.400",
                  transform: "translateY(-1px)",
                  shadow: "md",
                }}
                _active={{
                  transform: "translateY(0px)",
                }}
                transition="all 0.2s"
                fontWeight="bold"
                fontSize="sm"
              >
                {totalPages}
              </Button>
            </>
          )}

          {/* Next Button */}
          <IconButton
            aria-label="Next page"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            bg="white"
            borderColor="gray.300"
            borderRadius="lg"
            size="md"
            w="44px"
            h="44px"
            _hover={{
              bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              transform: "translateY(-2px)",
              shadow: "lg",
              borderColor: "transparent",
            }}
            _active={{
              transform: "translateY(0px)",
              shadow: "md",
            }}
            _disabled={{
              opacity: 0.3,
              cursor: "not-allowed",
              _hover: {
                transform: "none",
                shadow: "none",
                bg: "white",
                color: "gray.500",
                borderColor: "gray.300",
              },
            }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <Text fontSize="md" fontWeight="bold">
              ›
            </Text>
          </IconButton>
        </HStack>
      </Box>
    </VStack>
  );
};

export default Pagination;
