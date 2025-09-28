import React from "react";
import {
  HStack,
  Button,
  Text,
  IconButton,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    <Box p={4} w="fit-content" mx="auto">
      <HStack gap={8} align="center" justify="space-between" minW="400px">
        <HStack gap={1} align="center">
          <Text
            fontSize="md"
            color={currentPage === 1 ? "gray.400" : "#667eea"}
            cursor={currentPage === 1 ? "not-allowed" : "pointer"}
            onClick={
              currentPage === 1
                ? undefined
                : () => onPageChange(currentPage - 1)
            }
            _hover={currentPage === 1 ? {} : { color: "#764ba2" }}
            transition="color 0.2s ease"
          >
            ‹
          </Text>
          <Text
            fontSize="sm"
            color={currentPage === 1 ? "gray.400" : "#667eea"}
            cursor={currentPage === 1 ? "not-allowed" : "pointer"}
            onClick={
              currentPage === 1
                ? undefined
                : () => onPageChange(currentPage - 1)
            }
            _hover={currentPage === 1 ? {} : { color: "#764ba2" }}
            transition="color 0.2s ease"
          >
            {t("pagination.previous")}
          </Text>
        </HStack>

        <Text fontSize="sm" fontWeight="bold" color="gray.800">
          {t("pagination.page")} {currentPage}, {t("pagination.total")}{" "}
          {totalPages} {t("pagination.page")}
        </Text>

        <HStack gap={1} align="center">
          <Text
            fontSize="sm"
            color={currentPage === totalPages ? "gray.400" : "#667eea"}
            cursor={currentPage === totalPages ? "not-allowed" : "pointer"}
            onClick={
              currentPage === totalPages
                ? undefined
                : () => onPageChange(currentPage + 1)
            }
            _hover={currentPage === totalPages ? {} : { color: "#764ba2" }}
            transition="color 0.2s ease"
          >
            {t("pagination.next")}
          </Text>
          <Text
            fontSize="md"
            color={currentPage === totalPages ? "gray.400" : "#667eea"}
            cursor={currentPage === totalPages ? "not-allowed" : "pointer"}
            onClick={
              currentPage === totalPages
                ? undefined
                : () => onPageChange(currentPage + 1)
            }
            _hover={currentPage === totalPages ? {} : { color: "#764ba2" }}
            transition="color 0.2s ease"
          >
            ›
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default Pagination;
