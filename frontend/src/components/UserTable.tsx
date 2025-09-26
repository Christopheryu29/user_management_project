import React from "react";
import {
  Table,
  Box,
  Button,
  HStack,
  Badge,
} from "@chakra-ui/react";
// Using emoji icons
import { User } from "../types/User";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
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
      borderWidth="1px"
      borderColor="gray.200"
      overflow="hidden"
    >
      <Table.Root size="md" variant="outline">
        <Table.Header bg="gray.50">
          <Table.Row>
            <Table.ColumnHeader fontSize="sm" fontWeight="bold" color="gray.700">
              Name
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="sm" fontWeight="bold" color="gray.700">
              Gender
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="sm" fontWeight="bold" color="gray.700">
              Birthday
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="sm" fontWeight="bold" color="gray.700">
              Occupation
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="sm" fontWeight="bold" color="gray.700">
              Phone
            </Table.ColumnHeader>
            <Table.ColumnHeader fontSize="sm" fontWeight="bold" color="gray.700">
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user, index) => (
            <Table.Row
              key={user._id}
              _hover={{ bg: "gray.50" }}
              borderBottom={index === users.length - 1 ? "none" : "1px"}
              borderColor="gray.200"
            >
              <Table.Cell fontWeight="medium" color="gray.800">
                {user.name}
              </Table.Cell>
              <Table.Cell color="gray.600">{user.gender}</Table.Cell>
              <Table.Cell color="gray.600">{formatDate(user.birthday)}</Table.Cell>
              <Table.Cell>
                <Badge
                  colorPalette={getOccupationColor(user.occupation)}
                  fontSize="xs"
                  px={2}
                  py={1}
                  rounded="full"
                >
                  {user.occupation}
                </Badge>
              </Table.Cell>
              <Table.Cell color="gray.600">{user.phone}</Table.Cell>
              <Table.Cell>
                <HStack gap={2}>
                  <Button
                    colorPalette="blue"
                    variant="solid"
                    size="xs"
                    onClick={() => onEdit(user)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    colorPalette="red"
                    variant="solid"
                    size="xs"
                    onClick={() => onDelete(user._id)}
                  >
                    🗑️ Delete
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