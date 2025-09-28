import React, { useState } from "react";
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
import "./i18n";
import { useTranslation } from "react-i18next";
import UserCard from "./components/UserCard";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";
import Pagination from "./components/Pagination";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useDebounce } from "./hooks/useDebounce";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./hooks/useUsers";
import { User, UserFormData } from "./types/User";
import "./i18n";

type ViewMode = "card" | "table";

function App() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { open, onOpen, onClose } = useDisclosure();
  const toaster = createToaster({
    placement: "top-right",
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // React Query hooks
  const {
    data: usersData,
    isLoading,
    isError,
  } = useUsers(currentPage, 6, debouncedSearchTerm);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Extract data from the response
  const users = (usersData as any)?.users || [];
  const totalUsers = (usersData as any)?.total || 0;
  const totalPages = (usersData as any)?.totalPages || 1;

  const handleAddUser = () => {
    setEditingUser(null);
    onOpen();
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    onOpen();
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(t("messages.deleteConfirm"))) {
      deleteUserMutation.mutate(userId, {
        onSuccess: () => {
          toaster.create({
            title: `✅ ${t("messages.success")}`,
            description: t("messages.userDeleted"),
            status: "success",
            duration: 3000,
          });
        },
        onError: (err: any) => {
          toaster.create({
            title: `❌ ${t("messages.error")}`,
            description: t("messages.deleteFailed"),
            status: "error",
            duration: 3000,
          });
          console.error("Error deleting user:", err);
        },
      });
    }
  };

  const handleModalSubmit = async (userData: UserFormData) => {
    if (editingUser) {
      updateUserMutation.mutate(
        { id: editingUser._id, userData },
        {
          onSuccess: () => {
            toaster.create({
              title: `✅ ${t("messages.success")}`,
              description: t("messages.userUpdated"),
              status: "success",
              duration: 3000,
            });
            onClose();
            setEditingUser(null);
          },
          onError: (err: any) => {
            const message =
              err?.response?.data?.message || t("messages.updateFailed");
            toaster.create({
              title: `❌ ${t("messages.error")}`,
              description: message,
              status: "error",
              duration: 4000,
            });
            console.error("Error updating user:", err);
            throw err;
          },
        }
      );
    } else {
      createUserMutation.mutate(userData, {
        onSuccess: () => {
          toaster.create({
            title: `✅ ${t("messages.success")}`,
            description: t("messages.userCreated"),
            status: "success",
            duration: 3000,
          });
          onClose();
          setEditingUser(null);
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || t("messages.createFailed");
          toaster.create({
            title: `❌ ${t("messages.error")}`,
            description: message,
            status: "error",
            duration: 4000,
          });
          console.error("Error creating user:", err);
          throw err;
        },
      });
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
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        shadow="sm"
      >
        <Container maxW="7xl" px={6} py={4}>
          <VStack gap={4}>
            <HStack justify="space-between" align="center" w="100%">
              <HStack gap={4} align="center">
                <Image
                  src="/company_logo.png"
                  alt="Company Logo"
                  w="80px"
                  h="80px"
                  objectFit="contain"
                  onError={(e) => {
                    e.currentTarget.src = "/default-person.png";
                  }}
                />

                <VStack gap={0} align="start">
                  <Heading
                    size="md"
                    fontWeight="600"
                    color="gray.900"
                    letterSpacing="-0.01em"
                  >
                    {t("app.title")}
                  </Heading>
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    {t("app.subtitle")}
                  </Text>
                </VStack>
              </HStack>

              <HStack gap={3}>
                <LanguageSwitcher />
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
                    bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
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
            </HStack>

            <Box
              w="100%"
              py={2}
              px={4}
              bg="gray.50"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <HStack gap={8} justify="center">
                <HStack gap={2} align="center">
                  <Box w="6px" h="6px" borderRadius="full" bg="blue.500" />
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    <Text as="span" fontWeight="bold" color="blue.600">
                      {totalUsers}
                    </Text>{" "}
                    users
                  </Text>
                </HStack>

                <HStack gap={2} align="center">
                  <Box w="6px" h="6px" borderRadius="full" bg="green.500" />
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Page{" "}
                    <Text as="span" fontWeight="bold" color="green.600">
                      {currentPage}
                    </Text>{" "}
                    of {totalPages}
                  </Text>
                </HStack>
              </HStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      <Container maxW="7xl" py={8} px={8}>
        <Box
          bg="white"
          borderRadius="xl"
          p={6}
          shadow="md"
          border="1px solid"
          borderColor="gray.200"
          mb={6}
        >
          <HStack gap={6} align="center" justify="space-between" wrap="wrap">
            <Box flex={1} minW="350px" maxW="600px">
              <VStack gap={1} align="start">
                <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                  {t("search.title")}
                </Text>
                <Input
                  placeholder={t("search.placeholder")}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  bg="gray.50"
                  border="2px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  size="md"
                  _focus={{
                    borderColor: "blue.500",
                    bg: "white",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  }}
                  _hover={{
                    borderColor: "gray.300",
                    bg: "white",
                  }}
                  transition="all 0.2s ease"
                />
              </VStack>
            </Box>

            <VStack gap={2} align="start">
              <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                {t("search.viewMode")}
              </Text>
              <HStack gap={1} bg="gray.100" rounded="lg" p={1}>
                <Button
                  onClick={() => setViewMode("card")}
                  bg={
                    viewMode === "card"
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "transparent"
                  }
                  color={viewMode === "card" ? "white" : "gray.600"}
                  shadow={viewMode === "card" ? "md" : "none"}
                  rounded="md"
                  px={4}
                  py={2}
                  fontWeight="semibold"
                  size="sm"
                  transition="all 0.2s ease"
                  _hover={{
                    bg:
                      viewMode === "card"
                        ? "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)"
                        : "gray.200",
                    transform: "translateY(-1px)",
                    shadow: viewMode === "card" ? "lg" : "sm",
                  }}
                >
                  <HStack gap={2}>
                    <Text fontSize="sm">⊞</Text>
                    <Text fontSize="sm">{t("search.gridView")}</Text>
                  </HStack>
                </Button>
                <Button
                  onClick={() => setViewMode("table")}
                  bg={
                    viewMode === "table"
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "transparent"
                  }
                  color={viewMode === "table" ? "white" : "gray.600"}
                  shadow={viewMode === "table" ? "md" : "none"}
                  rounded="md"
                  px={4}
                  py={2}
                  fontWeight="semibold"
                  size="sm"
                  transition="all 0.2s ease"
                  _hover={{
                    bg:
                      viewMode === "table"
                        ? "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)"
                        : "gray.200",
                    transform: "translateY(-1px)",
                    shadow: viewMode === "table" ? "lg" : "sm",
                  }}
                >
                  <HStack gap={2}>
                    <Text fontSize="sm">☰</Text>
                    <Text fontSize="sm">{t("search.tableView")}</Text>
                  </HStack>
                </Button>
              </HStack>
            </VStack>
          </HStack>
        </Box>

        {isError && (
          <Card.Root bg="red.50" borderColor="red.200" borderWidth={2} mt={6}>
            <Card.Body p={6}>
              <HStack justify="space-between" align="center">
                <HStack gap={3}>
                  <Text fontSize="xl">❌</Text>
                  <Text color="red.600" fontWeight="medium">
                    Failed to load users. Please make sure the backend server is
                    running.
                  </Text>
                </HStack>
                <Button
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </HStack>
            </Card.Body>
          </Card.Root>
        )}

        <Box mt={8}>
          {isLoading ? (
            <Card.Root>
              <Card.Body py={20}>
                <VStack gap={6}>
                  <Spinner size="xl" color="blue.500" />
                  <Text fontSize="lg" color="gray.600" fontWeight="medium">
                    {t("messages.loadingUsers")}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {t("messages.pleaseWait")}
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
                      {searchTerm
                        ? t("messages.noMatchingUsers")
                        : t("messages.noUsers")}
                    </Heading>
                    <Text
                      fontSize="lg"
                      color="gray.500"
                      textAlign="center"
                      maxW="md"
                    >
                      {searchTerm
                        ? t("messages.noMatchingDescription")
                        : t("messages.noUsersDescription")}
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
                        <Text>{t("messages.addFirstUser")}</Text>
                      </HStack>
                    </Button>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>
          ) : (
            <VStack gap={8}>
              {viewMode === "card" ? (
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  gap={6}
                  w="100%"
                  minChildWidth="320px"
                >
                  {users.map((user: User) => (
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

      <UserModal
        isOpen={open}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        user={editingUser}
        title={
          editingUser ? `✏️ ${t("modal.editUser")}` : `👤 ${t("modal.addUser")}`
        }
      />
    </Box>
  );
}

export default App;
