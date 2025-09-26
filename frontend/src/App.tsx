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
  createToaster,
  useDisclosure,
  Card,
  Image,
} from "@chakra-ui/react";
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { open, onOpen, onClose } = useDisclosure();
  const toaster = createToaster({
    placement: "top-right",
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
      setTotalUsers(response.total);
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
          title: "✅ Success",
          description: "User deleted successfully!",
          status: "success",
          duration: 3000,
        });
        loadUsers();
      } catch (err) {
        toaster.create({
          title: "❌ Error",
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
        toaster.create({
          title: "✅ Success",
          description: "User updated successfully!",
          status: "success",
          duration: 3000,
        });
      } else {
        await userService.createUser(userData);
        toaster.create({
          title: "✅ Success",
          description: "User created successfully!",
          status: "success",
          duration: 3000,
        });
      }
      onClose();
      setEditingUser(null);
      loadUsers();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (editingUser ? "Failed to update user" : "Failed to create user");
      toaster.create({
        title: "❌ Error",
        description: message,
        status: "error",
        duration: 4000,
      });
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

  const handleCloseModal = () => {
    onClose();
    setEditingUser(null);
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Modern Professional Header */}
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        shadow="sm"
      >
        <Container maxW="7xl" px={8} py={5}>
          <HStack justify="space-between" align="center">
            {/* Enhanced Brand Section */}
            <HStack gap={4} align="center">
              <Box
                w="44px"
                h="44px"
                borderRadius="xl"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                p={2}
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="md"
              >
                <Image
                  src="/company_logo.png"
                  alt="Company Logo"
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  onError={(e) => {
                    e.currentTarget.src = "/default-person.png";
                  }}
                />
              </Box>
              <VStack gap={0} align="start">
                <Heading size="md" fontWeight="600" color="gray.900">
                  User Management
                </Heading>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                  Dashboard
                </Text>
              </VStack>
            </HStack>

            {/* Action Button */}
            <Button
              onClick={handleAddUser}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              size="sm"
              px={5}
              py={2}
              borderRadius="md"
              fontWeight="semibold"
              _hover={{
                bg: "blue.700",
                transform: "translateY(-1px)",
                shadow: "sm",
              }}
              _active={{
                transform: "translateY(0px)",
              }}
              transition="all 0.2s"
            >
              <HStack gap={1}>
                <Text fontSize="sm">+</Text>
                <Text fontSize="sm">Add User</Text>
              </HStack>
            </Button>
          </HStack>
        </Container>
      </Box>

      {/* Clean Stats Section */}
      <Box bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
        <Container maxW="7xl" px={6} py={3}>
          <HStack gap={8} justify="center">
            {/* Total Users */}
            <HStack gap={2} align="center">
              <Box w="8px" h="8px" borderRadius="full" bg="blue.500" />
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Total Users:
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.900">
                {totalUsers}
              </Text>
            </HStack>

            {/* Current Page */}
            <HStack gap={2} align="center">
              <Box w="8px" h="8px" borderRadius="full" bg="green.500" />
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Page:
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="gray.900">
                {currentPage} of {totalPages}
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8} px={8}>
        {/* Enhanced Search and Controls */}
        <Box
          bg="white"
          borderRadius="xl"
          p={6}
          shadow="sm"
          border="1px solid"
          borderColor="gray.200"
          mb={8}
        >
          <HStack gap={6} align="center" justify="space-between" wrap="wrap">
            {/* Enhanced Search Input */}
            <Box flex={1} minW="350px" maxW="600px">
              <VStack gap={1} align="start">
                <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                  Search Users
                </Text>
                <Input
                  placeholder="Search by name, occupation, or phone number..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="lg"
                  size="lg"
                  _focus={{
                    borderColor: "#667eea",
                    boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                    bg: "white",
                  }}
                  _hover={{
                    borderColor: "gray.400",
                    bg: "white",
                  }}
                  fontSize="md"
                />
              </VStack>
            </Box>

            {/* Enhanced View Mode Toggle */}
            <VStack gap={2} align="start">
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                View Mode
              </Text>
              <HStack gap={1} bg="gray.100" rounded="lg" p={1}>
                <Button
                  onClick={() => setViewMode("card")}
                  bg={viewMode === "card" ? "white" : "transparent"}
                  color={viewMode === "card" ? "gray.900" : "gray.600"}
                  shadow={viewMode === "card" ? "md" : "none"}
                  rounded="md"
                  px={4}
                  py={3}
                  transition="all 0.2s"
                  fontWeight="semibold"
                  size="md"
                  _hover={{
                    bg: viewMode === "card" ? "white" : "gray.200",
                    transform: "translateY(-1px)",
                  }}
                >
                  <HStack gap={2}>
                    <Text fontSize="md">⊞</Text>
                    <Text fontSize="md">Grid View</Text>
                  </HStack>
                </Button>
                <Button
                  onClick={() => setViewMode("table")}
                  bg={viewMode === "table" ? "white" : "transparent"}
                  color={viewMode === "table" ? "gray.900" : "gray.600"}
                  shadow={viewMode === "table" ? "md" : "none"}
                  rounded="md"
                  px={4}
                  py={3}
                  transition="all 0.2s"
                  fontWeight="semibold"
                  size="md"
                  _hover={{
                    bg: viewMode === "table" ? "white" : "gray.200",
                    transform: "translateY(-1px)",
                  }}
                >
                  <HStack gap={2}>
                    <Text fontSize="md">☰</Text>
                    <Text fontSize="md">Table View</Text>
                  </HStack>
                </Button>
              </HStack>
            </VStack>
          </HStack>
        </Box>

        {/* Error Display */}
        {error && (
          <Card.Root bg="red.50" borderColor="red.200" borderWidth={2} mt={6}>
            <Card.Body p={6}>
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Text fontSize="xl">❌</Text>
                  <Text color="red.600" fontWeight="medium">
                    {error}
                  </Text>
                </HStack>
                <Button
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => setError(null)}
                >
                  ✕
                </Button>
              </HStack>
            </Card.Body>
          </Card.Root>
        )}

        {/* Content */}
        <Box mt={8}>
          {loading ? (
            <Card.Root>
              <Card.Body py={20}>
                <VStack gap={6}>
                  <Spinner size="xl" color="blue.500" />
                  <Text fontSize="lg" color="gray.600" fontWeight="medium">
                    Loading users...
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Please wait while we fetch your data
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>
          ) : users.length === 0 ? (
            <Card.Root>
              <Card.Body py={20}>
                <VStack gap={6}>
                  <Text fontSize="8xl">👥</Text>
                  <VStack gap={3}>
                    <Heading size="xl" color="gray.700">
                      {searchTerm ? "No matching users found" : "No users yet"}
                    </Heading>
                    <Text
                      fontSize="lg"
                      color="gray.500"
                      textAlign="center"
                      maxW="md"
                    >
                      {searchTerm
                        ? "Try adjusting your search terms or clear the search to see all users."
                        : "Get started by adding your first user to the system."}
                    </Text>
                  </VStack>
                  {!searchTerm && (
                    <Button
                      colorPalette="blue"
                      size="lg"
                      onClick={handleAddUser}
                      mt={4}
                      px={8}
                      py={6}
                      borderRadius="xl"
                      shadow="lg"
                    >
                      <HStack gap={2}>
                        <Text fontSize="lg">👤</Text>
                        <Text>Add Your First User</Text>
                      </HStack>
                    </Button>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>
          ) : (
            <VStack gap={8}>
              {/* Users Display */}
              {viewMode === "card" ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  gap={6}
                  w="100%"
                  minChildWidth="320px"
                >
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
                <Box w="100%">
                  <UserTable
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                  />
                </Box>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Card.Root w="fit-content" mx="auto">
                  <Card.Body p={6}>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </Card.Body>
                </Card.Root>
              )}
            </VStack>
          )}
        </Box>
      </Container>

      {/* Enhanced Modal */}
      <UserModal
        isOpen={open}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        user={editingUser}
        title={editingUser ? "✏️ Edit User" : "👤 Add New User"}
      />
    </Box>
  );
}

export default App;
