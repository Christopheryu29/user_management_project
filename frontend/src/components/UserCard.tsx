import React from "react";
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
import { User } from "../types/User";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const getImageSrc = () => {
    if (user.image) {
      // Check if it's already a full URL (Cloudinary)
      if (user.image.startsWith('http')) {
        return user.image;
      }
      // Fallback for local uploads (if any)
      return `http://localhost:5001/uploads/${user.image}`;
    }
    return "/default-person.png";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
    <Card.Root
      shadow="xl"
      borderRadius="2xl" 
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: "translateY(-8px)",
        shadow: "2xl",
        borderColor: "blue.200",
      }}
      borderWidth="1px"
      borderColor="gray.100"
      bg="white"
      position="relative"
    >
      {/* Gradient Header */}
      <Box
        h="20px"
        bg={`linear-gradient(90deg, ${getOccupationColor(user.occupation)}.400, ${getOccupationColor(user.occupation)}.600)`}
      />
      
      <Card.Body p={8}>
        <VStack gap={6} align="center">
          {/* Profile Image */}
          <Box position="relative">
            <Box
              position="relative"
              w="80px"
              h="80px"
              borderRadius="full"
              overflow="hidden"
              borderWidth="4px"
              borderColor="white"
              shadow="xl"
              bg="gray.100"
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
            </Box>
            
            {/* Status Indicator */}
            <Box
              position="absolute"
              bottom={2}
              right={2}
              bg="green.400"
              borderRadius="full"
              w={4}
              h={4}
              borderWidth="2px"
              borderColor="white"
            />
          </Box>

          {/* User Info */}
          <VStack gap={3} align="center" textAlign="center">
            <VStack gap={1}>
              <Heading size="lg" color="gray.800" fontWeight="bold">
                {user.name}
              </Heading>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">
                {getAge(user.birthday)} years old
              </Text>
            </VStack>

            <Badge
              colorPalette={getOccupationColor(user.occupation)}
              size="lg"
              px={4}
              py={2}
              borderRadius="full"
              fontWeight="semibold"
              fontSize="sm"
            >
              {getOccupationIcon(user.occupation)} {user.occupation}
            </Badge>
          </VStack>

          <Separator />

          {/* Details */}
          <VStack gap={4} w="100%" align="stretch">
            <Flex justify="space-between" align="center">
              <HStack gap={2}>
                <Text fontSize="lg">{getGenderIcon(user.gender)}</Text>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Gender
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {user.gender}
              </Text>
            </Flex>

            <Flex justify="space-between" align="center">
              <HStack gap={2}>
                <Text fontSize="lg">🎂</Text>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Birthday
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {formatDate(user.birthday)}
              </Text>
            </Flex>

            <Flex justify="space-between" align="center">
              <HStack gap={2}>
                <Text fontSize="lg">📞</Text>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Phone
                </Text>
              </HStack>
              <Text 
                fontSize="sm" 
                color="blue.600" 
                fontWeight="medium"
                fontFamily="mono"
              >
                {user.phone}
              </Text>
            </Flex>
          </VStack>

          <Separator />

          {/* Action Buttons */}
          <HStack gap={4} w="100%">
            <Button
              colorPalette="blue"
              variant="solid"
              size="md"
              onClick={() => onEdit(user)}
              flex={1}
              borderRadius="xl"
              fontWeight="semibold"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "lg",
              }}
              transition="all 0.2s"
            >
              <HStack gap={2}>
                <Text>✏️</Text>
                <Text>Edit</Text>
              </HStack>
            </Button>
            
            <Button
              colorPalette="red"
              variant="solid"
              size="md"
              onClick={() => onDelete(user._id)}
              flex={1}
              borderRadius="xl"
              fontWeight="semibold"
              _hover={{
                transform: "translateY(-2px)", 
                shadow: "lg",
              }}
              transition="all 0.2s"
            >
              <HStack gap={2}>
                <Text>🗑️</Text>
                <Text>Delete</Text>
              </HStack>
            </Button>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export default UserCard;