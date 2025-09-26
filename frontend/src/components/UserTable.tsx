import React from "react";
import {
  Table,
  Box,
  Button,
  HStack,
  Badge,
  Image,
  VStack,
  Text,
  Card,
  Heading,
} from "@chakra-ui/react";
import { User } from "../types/User";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const getImageSrc = (user: User) => {
    if (user.image) {
      if (user.image.startsWith('http')) {
        return user.image;
      }
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
    <Card.Root shadow="xl" borderRadius="2xl" overflow="hidden">
      {/* Table Header */}
      <Box bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" p={6}>
        <Heading size="lg" color="white" textAlign="center">
          📋 Users Table View
        </Heading>
      </Box>

      <Box bg="white">
        <Table.Root size="lg">
          <Table.Header bg="gray.50" borderBottomWidth="2px" borderColor="gray.200">
            <Table.Row>
              <Table.ColumnHeader 
                fontSize="sm" 
                fontWeight="bold" 
                color="gray.700" 
                py={4}
                px={6}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                👤 User
              </Table.ColumnHeader>
              <Table.ColumnHeader 
                fontSize="sm" 
                fontWeight="bold" 
                color="gray.700"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                🎂 Age & Gender
              </Table.ColumnHeader>
              <Table.ColumnHeader 
                fontSize="sm" 
                fontWeight="bold" 
                color="gray.700"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                💼 Occupation
              </Table.ColumnHeader>
              <Table.ColumnHeader 
                fontSize="sm" 
                fontWeight="bold" 
                color="gray.700"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                📞 Contact
              </Table.ColumnHeader>
              <Table.ColumnHeader 
                fontSize="sm" 
                fontWeight="bold" 
                color="gray.700"
                textTransform="uppercase"
                letterSpacing="wide"
                textAlign="center"
              >
                ⚡ Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user, index) => (
              <Table.Row
                key={user._id}
                _hover={{ 
                  bg: "blue.50", 
                  transform: "scale(1.01)",
                  shadow: "md" 
                }}
                transition="all 0.2s"
                borderBottomWidth={index === users.length - 1 ? 0 : "1px"}
                borderColor="gray.100"
              >
                {/* User Info */}
                <Table.Cell py={6} px={6}>
                  <HStack gap={4}>
                    <Box
                      w="50px"
                      h="50px"
                      borderRadius="full"
                      overflow="hidden"
                      borderWidth="2px"
                      borderColor="gray.200"
                      shadow="md"
                      bg="gray.100"
                    >
                      <Image
                        src={getImageSrc(user)}
                        alt={user.name}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-person.png";
                        }}
                      />
                    </Box>
                    <VStack align="start" gap={1}>
                      <Text fontWeight="bold" color="gray.800" fontSize="md">
                        {user.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Born {formatDate(user.birthday)}
                      </Text>
                    </VStack>
                  </HStack>
                </Table.Cell>

                {/* Age & Gender */}
                <Table.Cell py={6}>
                  <VStack align="start" gap={1}>
                    <HStack gap={2}>
                      <Text fontSize="lg">{getGenderIcon(user.gender)}</Text>
                      <Text fontWeight="semibold" color="gray.700">
                        {user.gender}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      {getAge(user.birthday)} years old
                    </Text>
                  </VStack>
                </Table.Cell>

                {/* Occupation */}
                <Table.Cell py={6}>
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
                </Table.Cell>

                {/* Contact */}
                <Table.Cell py={6}>
                  <VStack align="start" gap={1}>
                    <Text 
                      fontFamily="mono" 
                      fontSize="sm" 
                      color="blue.600"
                      fontWeight="semibold"
                    >
                      {user.phone}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Phone Number
                    </Text>
                  </VStack>
                </Table.Cell>

                {/* Actions */}
                <Table.Cell py={6}>
                  <HStack gap={3} justify="center">
                    <Button
                      size="md"
                      colorPalette="blue"
                      variant="solid"
                      onClick={() => onEdit(user)}
                      borderRadius="lg"
                      px={4}
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "lg",
                      }}
                      transition="all 0.2s"
                    >
                      <HStack gap={1}>
                        <Text>✏️</Text>
                        <Text fontWeight="semibold">Edit</Text>
                      </HStack>
                    </Button>
                    <Button
                      size="md"
                      colorPalette="red"
                      variant="solid"
                      onClick={() => onDelete(user._id)}
                      borderRadius="lg"
                      px={4}
                      _hover={{
                        transform: "translateY(-2px)",
                        shadow: "lg",
                      }}
                      transition="all 0.2s"
                    >
                      <HStack gap={1}>
                        <Text>🗑️</Text>
                        <Text fontWeight="semibold">Delete</Text>
                      </HStack>
                    </Button>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Card.Root>
  );
};

export default UserTable;