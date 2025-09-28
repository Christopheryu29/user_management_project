import React, { useState, useEffect, useRef } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === "zh" ? "繁體中文" : "English";
  };

  const getCurrentLanguageFlag = () => {
    return i18n.language === "zh" ? "🇹🇼" : "🇺🇸";
  };

  return (
    <Box position="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        colorPalette="blue"
        borderRadius="lg"
        px={3}
        py={2}
        onClick={() => setIsOpen(!isOpen)}
        _hover={{
          bg: "blue.50",
          borderColor: "blue.300",
        }}
      >
        <HStack gap={2}>
          <Text fontSize="sm">{getCurrentLanguageFlag()}</Text>
          <Text fontSize="sm" fontWeight="medium">
            {getCurrentLanguageLabel()}
          </Text>
          <Text fontSize="xs">{isOpen ? "▲" : "▼"}</Text>
        </HStack>
      </Button>

      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          right={0}
          mt={1}
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          shadow="md"
          zIndex={1000}
          minW="120px"
        >
          <VStack gap={0} align="stretch">
            <Button
              variant="ghost"
              size="sm"
              justifyContent="flex-start"
              px={3}
              py={2}
              onClick={() => handleLanguageChange("en")}
              fontWeight={i18n.language === "en" ? "bold" : "normal"}
              bg={i18n.language === "en" ? "blue.50" : "transparent"}
              color={i18n.language === "en" ? "blue.700" : "gray.700"}
              _hover={{
                bg: i18n.language === "en" ? "blue.100" : "gray.50",
              }}
            >
              <HStack gap={2}>
                <Text>🇺🇸</Text>
                <Text>English</Text>
              </HStack>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              justifyContent="flex-start"
              px={3}
              py={2}
              onClick={() => handleLanguageChange("zh")}
              fontWeight={i18n.language === "zh" ? "bold" : "normal"}
              bg={i18n.language === "zh" ? "blue.50" : "transparent"}
              color={i18n.language === "zh" ? "blue.700" : "gray.700"}
              _hover={{
                bg: i18n.language === "zh" ? "blue.100" : "gray.50",
              }}
            >
              <HStack gap={2}>
                <Text>🇹🇼</Text>
                <Text>繁體中文</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default LanguageSwitcher;
