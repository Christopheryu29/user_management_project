import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Badge,
} from "@chakra-ui/react";
// Using emoji icons
import { User } from "../types/User";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const getImageSrc = () => {
    if (user.image) {
      return `http://localhost:5001/uploads/${user.image}`;
    }
    return "/default-person.png";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  return (
    <Box
      bg="white"
      shadow="lg"
      rounded="xl"
      p={6}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "xl",
      }}
      borderWidth="1px"
      borderColor="gray.100"
    >
      <VStack gap={4} align="center">
        <Box
          w="80px"
          h="80px"
          borderRadius="full"
          bg="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="2px solid"
          borderColor="blue.500"
          overflow="hidden"
        >
          <img
            src={getImageSrc()}
            alt={user.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default-person.png';
            }}
          />
        </Box>

        <VStack gap={2} align="center">
          <Heading size="md" textAlign="center" color="gray.800">
            {user.name}
          </Heading>

          <Badge
            colorPalette={getOccupationColor(user.occupation)}
            fontSize="sm"
            px={3}
            py={1}
            rounded="full"
          >
            {user.occupation}
          </Badge>
        </VStack>

        <VStack gap={1} align="center" w="100%">
          <Text fontSize="sm" color="gray.600">
            <Text as="span" fontWeight="semibold">
              Gender:
            </Text>{" "}
            {user.gender}
          </Text>
          <Text fontSize="sm" color="gray.600">
            <Text as="span" fontWeight="semibold">
              Birthday:
            </Text>{" "}
            {formatDate(user.birthday)}
          </Text>
          <Text fontSize="sm" color="gray.600" textAlign="center">
            <Text as="span" fontWeight="semibold">
              Phone:
            </Text>{" "}
            {user.phone}
          </Text>
        </VStack>

        <HStack gap={3} w="100%" justify="center">
          <Button
            colorPalette="blue"
            variant="solid"
            size="sm"
            onClick={() => onEdit(user)}
            flex={1}
          >
            ✏️ Edit
          </Button>
          <Button
            colorPalette="red"
            variant="solid"
            size="sm"
            onClick={() => onDelete(user._id)}
            flex={1}
          >
            🗑️ Delete
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default UserCard;