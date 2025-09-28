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
import { useTranslation } from "react-i18next";
import { User } from "../types/User";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const getImageSrc = (user: User) => {
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
      borderRadius="lg"
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
    >
      <Table.Root size="md">
        <Table.Header bg="gray.50">
          <Table.Row>
            <Table.ColumnHeader
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              py={3}
              px={4}
              borderRight="1px solid"
              borderColor="gray.300"
            >
              {t("user.name")}
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              py={3}
              px={4}
              borderRight="1px solid"
              borderColor="gray.300"
            >
              {t("user.gender")}
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              py={3}
              px={4}
              borderRight="1px solid"
              borderColor="gray.300"
            >
              {t("user.birthday")}
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              py={3}
              px={4}
              borderRight="1px solid"
              borderColor="gray.300"
            >
              {t("user.occupation")}
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              py={3}
              px={4}
              borderRight="1px solid"
              borderColor="gray.300"
            >
              {t("user.phone")}
            </Table.ColumnHeader>
            <Table.ColumnHeader
              fontSize="sm"
              fontWeight="semibold"
              color="gray.700"
              py={3}
              px={4}
              textAlign="center"
            >
              {t("user.actions")}
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user, index) => (
            <Table.Row
              key={user._id}
              bg="white"
              _hover={{
                bg: "gray.50",
                transform: "translateY(-1px)",
                shadow: "sm",
              }}
              transition="all 0.2s ease"
              borderBottom={index === users.length - 1 ? "none" : "1px solid"}
              borderColor="gray.200"
            >
              <Table.Cell
                py={4}
                px={6}
                borderRight="1px solid"
                borderColor="gray.200"
              >
                <Text fontSize="sm" color="gray.800" fontWeight="semibold">
                  {user.name}
                </Text>
              </Table.Cell>

              <Table.Cell
                py={4}
                px={4}
                borderRight="1px solid"
                borderColor="gray.200"
              >
                <HStack gap={2}>
                  <Text fontSize="sm">{getGenderIcon(user.gender)}</Text>
                  <Text fontSize="sm" color="gray.700" fontWeight="medium">
                    {t(`gender.${user.gender.toLowerCase()}`)}
                  </Text>
                </HStack>
              </Table.Cell>

              <Table.Cell
                py={4}
                px={4}
                borderRight="1px solid"
                borderColor="gray.200"
              >
                <Text fontSize="sm" color="gray.700" fontWeight="medium">
                  {formatDate(user.birthday)}
                </Text>
              </Table.Cell>

              <Table.Cell
                py={4}
                px={4}
                borderRight="1px solid"
                borderColor="gray.200"
              >
                <Badge
                  colorPalette={getOccupationColor(user.occupation)}
                  size="sm"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontWeight="semibold"
                  fontSize="xs"
                >
                  {getOccupationIcon(user.occupation)}{" "}
                  {t(`occupation.${user.occupation.toLowerCase()}`)}
                </Badge>
              </Table.Cell>

              <Table.Cell
                py={4}
                px={4}
                borderRight="1px solid"
                borderColor="gray.200"
              >
                <Text
                  fontSize="sm"
                  color="blue.600"
                  fontFamily="mono"
                  fontWeight="medium"
                >
                  {user.phone}
                </Text>
              </Table.Cell>

              <Table.Cell py={4} px={4}>
                <HStack gap={2} justify="center">
                  <Button
                    size="sm"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    color="white"
                    onClick={() => onEdit(user)}
                    borderRadius="lg"
                    px={3}
                    _hover={{
                      bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                      transform: "translateY(-1px)",
                      shadow: "md",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s ease"
                  >
                    <HStack gap={1}>
                      <Text fontSize="xs" fontWeight="bold">
                        ✏️
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold">
                        {t("actions.edit")}
                      </Text>
                    </HStack>
                  </Button>
                  <Button
                    size="sm"
                    bg="linear-gradient(135deg, #e53e3e 0%, #c53030 100%)"
                    color="white"
                    onClick={() => onDelete(user._id)}
                    borderRadius="lg"
                    px={3}
                    _hover={{
                      bg: "linear-gradient(135deg, #c53030 0%, #9c2626 100%)",
                      transform: "translateY(-1px)",
                      shadow: "md",
                    }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s ease"
                  >
                    <HStack gap={1}>
                      <Text fontSize="xs" fontWeight="bold">
                        🗑️
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold">
                        {t("actions.delete")}
                      </Text>
                    </HStack>
                  </Button>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default UserTable;
