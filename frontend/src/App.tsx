import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Heading,
  HStack,
  VStack,
  Button,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  Flex,
  Spacer,
  createToaster,
  useDisclosure,
} from "@chakra-ui/react";
// Temporarily using text placeholders for icons
import UserCard from "./components/UserCard";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import Pagination from "./components/Pagination";
import { useDebounce } from "./hooks/useDebounce";
import { userService } from "./services/userService";
import { User, UserFormData } from "./types/User";

type ViewMode = "card" | "table";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { open, onOpen, onClose } = useDisclosure();
  const toaster = createToaster({
    placement: "top",
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(
        currentPage,
        6,
        debouncedSearchTerm
      );
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(
        "Failed to load users. Please make sure the backend server is running."
      );
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleAddUser = () => {
    setEditingUser(null);
    onOpen();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    onOpen();
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(userId);
        toaster.create({
          title: "User deleted successfully",
          status: "success",
          duration: 3000,
        });
        loadUsers();
      } catch (err) {
        toaster.create({
          title: "Error",
          description: "Failed to delete user",
          status: "error",
          duration: 3000,
        });
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleModalSubmit = async (userData: UserFormData) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser._id, userData);
      } else {
        await userService.createUser(userData);
      }
      onClose();
      setEditingUser(null);
      loadUsers();
    } catch (err) {
      setError(editingUser ? "Failed to update user" : "Failed to create user");
      console.error("Error saving user:", err);
      throw err;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleCloseModal = () => {
    onClose();
    setEditingUser(null);
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" shadow="sm" borderBottomWidth="1px" borderColor="gray.200">
        <Container maxW="7xl" py={6}>
          <VStack gap={6}>
            <Heading textAlign="center" size="xl" color="gray.800" fontWeight="bold">
              User Management System
            </Heading>

            <Flex direction={{ base: "column", md: "row" }} gap={4} align="center" w="full">
              <HStack maxW={{ base: "100%", md: "300px" }}>
                <Text>🔍</Text>
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  bg="white"
                  borderColor="gray.200"
                />
              </HStack>

              <Spacer />

              <HStack gap={3}>
                <HStack gap={0}>
                  <Button
                    onClick={() => handleViewModeChange("card")}
                    variant={viewMode === "card" ? "solid" : "outline"}
                    colorPalette={viewMode === "card" ? "blue" : "gray"}
                    borderRightRadius={0}
                  >
                    👁️ Cards
                  </Button>
                  <Button
                    onClick={() => handleViewModeChange("table")}
                    variant={viewMode === "table" ? "solid" : "outline"}
                    colorPalette={viewMode === "table" ? "blue" : "gray"}
                    borderLeftRadius={0}
                  >
                    📋 Table
                  </Button>
                </HStack>

                <Button colorPalette="green" onClick={handleAddUser} size="sm">
                  ➕ Add User
                </Button>
              </HStack>
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        {error && (
          <Box
            bg="red.50"
            borderWidth="1px"
            borderColor="red.200"
            borderRadius="lg"
            p={4}
            mb={6}
            color="red.600"
          >
            {error}
            <Button
              size="sm"
              variant="ghost"
              colorPalette="red"
              onClick={() => setError(null)}
              ml={2}
            >
              ×
            </Button>
          </Box>
        )}

        {loading ? (
          <VStack gap={4} py={20}>
            <Spinner size="xl" color="blue.500" />
            <Text color="gray.600">Loading users...</Text>
          </VStack>
        ) : (
          <>
            {users.length === 0 ? (
              <VStack gap={4} py={20}>
                <Text fontSize="lg" color="gray.600" textAlign="center">
                  {searchTerm
                    ? "No users found matching your search."
                    : "No users found. Add some users to get started."}
                </Text>
                {!searchTerm && (
                  <Button colorPalette="green" onClick={handleAddUser}>
                    ➕ Add Your First User
                  </Button>
                )}
              </VStack>
            ) : (
              <>
                {viewMode === "card" ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={8}>
                    {users.map((user) => (
                      <UserCard
                        key={user._id}
                        user={user}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box mb={8}>
                    <UserTable
                      users={users}
                      onEdit={handleEditUser}
                      onDelete={handleDeleteUser}
                    />
                  </Box>
                )}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </Container>

      {/* Modal */}
      <UserModal
        isOpen={open}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        user={editingUser}
        title={editingUser ? "Edit User" : "Add New User"}
      />
    </Box>
  );
}

export default App;