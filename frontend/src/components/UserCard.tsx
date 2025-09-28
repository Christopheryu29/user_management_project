import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
  Card,
  Flex,
  Separator,
  Image,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { User } from "../types/User";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const getImageSrc = () => {
    if (user.image) {
      if (user.image.startsWith("http")) {
        return user.image;
      }

      return `http://localhost:5001/uploads/${user.image}`;
    }
    return "/default-person.png";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getOccupationColor = (occupation: string) => {
    const colors = {
      Student: "blue",
      Engineer: "green",
      Teacher: "purple",
      Unemployed: "orange",
    };
    return colors[occupation as keyof typeof colors] || "gray";
  };

  const getOccupationIcon = (occupation: string) => {
    const icons = {
      Student: "🎓",
      Engineer: "👷",
      Teacher: "👨‍🏫",
      Unemployed: "🔍",
    };
    return icons[occupation as keyof typeof icons] || "💼";
  };

  const getGenderIcon = (gender: string) => {
    const icons = {
      Male: "👨",
      Female: "👩",
      Other: "🧑",
    };
    return icons[gender as keyof typeof icons] || "👤";
  };

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      shadow="lg"
      border="1px solid"
      borderColor="gray.100"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        shadow: "2xl",
        borderColor: "gray.200",
        transform: "translateY(-4px)",
      }}
      w="100%"
      maxW="320px"
      position="relative"
    >
      <Box
        bg="linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
        h="220px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
        cursor="pointer"
        _hover={{ transform: "scale(1.02)" }}
        transition="transform 0.2s ease"
        onClick={() => setIsImageModalOpen(true)}
      >
        <Image
          src={getImageSrc()}
          alt={user.name}
          w="100%"
          h="100%"
          objectFit="cover"
          onError={(e) => {
            e.currentTarget.src = "/default-person.png";
          }}
        />

        <Box
          position="absolute"
          top={4}
          right={4}
          bg="green.500"
          borderRadius="full"
          w={4}
          h={4}
          borderWidth="3px"
          borderColor="white"
          shadow="md"
        />

        <Box
          position="absolute"
          top={4}
          left={4}
          bg="blackAlpha.600"
          borderRadius="full"
          w={8}
          h={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
          opacity={0}
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s ease"
        >
          <Text fontSize="sm" color="white">
            🔍
          </Text>
        </Box>
      </Box>

      <Box p={4} pb={2}>
        <VStack gap={1} align="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.800"
            lineHeight="1.2"
            textAlign="center"
          >
            {user.name}
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            {getAge(user.birthday)} {t("user.yearsOld")}
          </Text>
        </VStack>
      </Box>

      <Box p={6} pt={2}>
        <VStack gap={4} align="stretch">
          <Badge
            colorPalette={getOccupationColor(user.occupation)}
            size="lg"
            px={4}
            py={2}
            borderRadius="full"
            fontWeight="bold"
            fontSize="sm"
            w="fit-content"
            shadow="sm"
          >
            {getOccupationIcon(user.occupation)}{" "}
            {t(`occupation.${user.occupation.toLowerCase()}`)}
          </Badge>

          <VStack gap={3} align="stretch">
            <Box
              bg="gray.50"
              p={3}
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <VStack gap={2} align="stretch">
                <Flex justify="space-between" align="center">
                  <HStack gap={2}>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="medium"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {t("user.gender")}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.800" fontWeight="bold">
                    {getGenderIcon(user.gender)}{" "}
                    {t(`gender.${user.gender.toLowerCase()}`)}
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <HStack gap={2}>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="medium"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {t("user.birthday")}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.800" fontWeight="bold">
                    {formatDate(user.birthday)}
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <HStack gap={2}>
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      fontWeight="medium"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {t("user.phone")}
                    </Text>
                  </HStack>
                  <Text
                    fontSize="sm"
                    color="#667eea"
                    fontWeight="bold"
                    fontFamily="mono"
                    cursor="pointer"
                    _hover={{ color: "#764ba2" }}
                    transition="color 0.2s ease"
                  >
                    {user.phone}
                  </Text>
                </Flex>
              </VStack>
            </Box>
          </VStack>

          <HStack gap={3} pt={2}>
            <Button
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              size="md"
              onClick={() => onEdit(user)}
              flex={1}
              borderRadius="xl"
              fontWeight="bold"
              shadow="md"
              _hover={{
                bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                transform: "translateY(-1px)",
                shadow: "lg",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s ease"
            >
              <HStack gap={2}>
                <Text fontSize="sm" fontWeight="bold">
                  ✏️
                </Text>
                <Text fontSize="sm">{t("actions.edit")}</Text>
              </HStack>
            </Button>

            <Button
              bg="linear-gradient(135deg, #e53e3e 0%, #c53030 100%)"
              color="white"
              size="md"
              onClick={() => onDelete(user._id)}
              flex={1}
              borderRadius="xl"
              fontWeight="bold"
              shadow="md"
              _hover={{
                bg: "linear-gradient(135deg, #c53030 0%, #9c2626 100%)",
                transform: "translateY(-1px)",
                shadow: "lg",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s ease"
            >
              <HStack gap={2}>
                <Text fontSize="sm" fontWeight="bold">
                  🗑️
                </Text>
                <Text fontSize="sm">{t("actions.delete")}</Text>
              </HStack>
            </Button>
          </HStack>
        </VStack>
      </Box>

      {isImageModalOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={1000}
          bg="blackAlpha.800"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            onClick={() => setIsImageModalOpen(false)}
            cursor="pointer"
          />

          <Box
            position="relative"
            maxW="90vw"
            maxH="90vh"
            borderRadius="2xl"
            overflow="hidden"
            shadow="2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              position="absolute"
              top={4}
              right={4}
              onClick={() => setIsImageModalOpen(false)}
              color="white"
              bg="blackAlpha.600"
              borderRadius="full"
              _hover={{ bg: "blackAlpha.800" }}
              size="lg"
              zIndex={1}
            >
              ✕
            </Button>

            <Image
              src={getImageSrc()}
              alt={user.name}
              w="100%"
              h="100%"
              objectFit="contain"
              onError={(e) => {
                e.currentTarget.src = "/default-person.png";
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserCard;
