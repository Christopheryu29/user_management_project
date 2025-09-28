import React, { useState, useEffect } from "react";
import {
  Button,
  Field,
  Input,
  NativeSelectRoot,
  NativeSelectField,
  VStack,
  HStack,
  Text,
  Box,
  Image,
  Card,
  Flex,
  Badge,
  Separator,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { User, UserFormData } from "../types/User";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
  user?: User | null;
  title: string;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  title,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    gender: "Male",
    birthday: "",
    occupation: "Student",
    phone: "",
    image: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        gender: user.gender,
        birthday: user.birthday.split("T")[0],
        occupation: user.occupation,
        phone: user.phone,
        image: null,
      });

      if (user.image) {
        if (user.image.startsWith("http")) {
          setImagePreview(user.image);
        } else {
          setImagePreview(`http://localhost:5001/uploads/${user.image}`);
        }
      }
    } else {
      setFormData({
        name: "",
        gender: "Male",
        birthday: "",
        occupation: "Student",
        phone: "",
        image: null,
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [user, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("validation.nameMinLength");
    } else if (formData.name.trim().length > 50) {
      newErrors.name = t("validation.nameMaxLength");
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      newErrors.name = t("validation.nameLettersOnly");
    }

    if (!formData.birthday) {
      newErrors.birthday = t("validation.birthdayRequired");
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age < 13 || age > 120) {
        newErrors.birthday = t("validation.ageRange");
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("validation.phoneRequired");
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = t("validation.phoneInvalid");
    } else if (
      formData.phone.replace(/\D/g, "").length < 10 ||
      formData.phone.replace(/\D/g, "").length > 15
    ) {
      newErrors.phone = t("validation.phoneLength");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={1000}
      bg="blackAlpha.600"
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
        onClick={onClose}
        cursor="pointer"
      />

      <Box
        position="relative"
        bg="white"
        shadow="2xl"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        maxH="90vh"
        overflowY="auto"
        w="full"
        maxW="2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          p={6}
          borderTopRadius="2xl"
        >
          <Box p={0}>
            <HStack justify="space-between" align="center">
              <HStack gap={3}>
                <Text fontSize="xl" fontWeight="bold">
                  {title}
                </Text>
              </HStack>
              <Button
                onClick={onClose}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                borderRadius="lg"
                size="sm"
              >
                ✕
              </Button>
            </HStack>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box p={8}>
            <VStack gap={8} align="stretch">
              <Card.Root bg="gray.50" p={6} borderRadius="xl">
                <VStack gap={4}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                    📷 {t("modal.profilePicture")}
                  </Text>

                  <Box
                    w="80px"
                    h="80px"
                    borderRadius="full"
                    overflow="hidden"
                    borderWidth="4px"
                    borderColor="white"
                    shadow="lg"
                    bg="gray.100"
                  >
                    <Image
                      src={imagePreview || "/default-person.png"}
                      alt={formData.name || "User"}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default-person.png";
                      }}
                    />
                  </Box>

                  <Field.Root>
                    <Input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      p={2}
                      borderRadius="lg"
                      bg="white"
                      borderWidth="2px"
                      borderStyle="dashed"
                      borderColor="gray.300"
                      _hover={{ borderColor: "blue.400" }}
                      _focus={{ borderColor: "blue.500" }}
                    />
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      {t("modal.uploadHelp")}
                    </Text>
                  </Field.Root>
                </VStack>
              </Card.Root>

              <Separator />

              <VStack gap={6} align="stretch">
                <Field.Root required invalid={!!errors.name}>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="gray.700"
                    mb={2}
                  >
                    <HStack gap={2}>
                      <Text>{t("user.name")}</Text>
                    </HStack>
                  </Text>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={`👤 ${t("user.name")}`}
                    size="lg"
                    borderRadius="xl"
                    bg="gray.50"
                    _focus={{ bg: "white", borderColor: "blue.400" }}
                  />
                  {errors.name && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.name}
                    </Text>
                  )}
                </Field.Root>

                <HStack gap={6} align="start">
                  <Field.Root flex={1} required>
                    <Text
                      fontSize="md"
                      fontWeight="semibold"
                      color="gray.700"
                      mb={2}
                    >
                      <HStack gap={2}>
                        <Text>{t("user.gender")}</Text>
                      </HStack>
                    </Text>
                    <NativeSelectRoot size="lg">
                      <NativeSelectField
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        borderRadius="xl"
                        bg="gray.50"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      >
                        <option value="Male">👨 {t("gender.male")}</option>
                        <option value="Female">👩 {t("gender.female")}</option>
                        <option value="Other">🧑 {t("gender.other")}</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Field.Root>

                  <Field.Root flex={1} required invalid={!!errors.birthday}>
                    <Text
                      fontSize="md"
                      fontWeight="semibold"
                      color="gray.700"
                      mb={2}
                    >
                      <HStack gap={2}>
                        <Text>{t("user.birthday")}</Text>
                      </HStack>
                    </Text>
                    <Input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      size="lg"
                      borderRadius="xl"
                      bg="gray.50"
                      _focus={{ bg: "white", borderColor: "blue.400" }}
                    />
                    {errors.birthday && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.birthday}
                      </Text>
                    )}
                  </Field.Root>
                </HStack>

                <Field.Root required>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="gray.700"
                    mb={2}
                  >
                    <HStack gap={2}>
                      <Text>{t("user.occupation")}</Text>
                    </HStack>
                  </Text>
                  <NativeSelectRoot size="lg">
                    <NativeSelectField
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      borderRadius="xl"
                      bg="gray.50"
                      _focus={{ bg: "white", borderColor: "blue.400" }}
                    >
                      <option value="Student">
                        🎓 {t("occupation.student")}
                      </option>
                      <option value="Engineer">
                        👷 {t("occupation.engineer")}
                      </option>
                      <option value="Teacher">
                        👨‍🏫 {t("occupation.teacher")}
                      </option>
                      <option value="Unemployed">
                        🔍 {t("occupation.unemployed")}
                      </option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field.Root>

                {/* Phone Field */}
                <Field.Root required invalid={!!errors.phone}>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color="gray.700"
                    mb={2}
                  >
                    <HStack gap={2}>
                      <Text>{t("user.phone")}</Text>
                    </HStack>
                  </Text>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={`📱 ${t("user.phone")}`}
                    size="lg"
                    borderRadius="xl"
                    bg="gray.50"
                    _focus={{ bg: "white", borderColor: "blue.400" }}
                    fontFamily="mono"
                  />
                  {errors.phone && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.phone}
                    </Text>
                  )}
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {t("modal.phoneExample")}
                  </Text>
                </Field.Root>
              </VStack>

              {/* Preview Card */}
              {formData.name && (
                <>
                  <Separator />
                  <Card.Root
                    bg="blue.50"
                    borderColor="blue.200"
                    borderWidth={1}
                  >
                    <Card.Body p={6}>
                      <VStack gap={4}>
                        <Text
                          fontSize="lg"
                          fontWeight="semibold"
                          color="blue.700"
                        >
                          📋 {t("modal.preview")}
                        </Text>
                        <HStack gap={6} w="100%" align="center">
                          <Box
                            w="50px"
                            h="50px"
                            borderRadius="full"
                            overflow="hidden"
                            bg="gray.100"
                          >
                            <Image
                              src={imagePreview || "/default-person.png"}
                              alt={formData.name}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                              onError={(e) => {
                                e.currentTarget.src = "/default-person.png";
                              }}
                            />
                          </Box>
                          <VStack align="start" flex={1}>
                            <Text
                              fontWeight="bold"
                              fontSize="lg"
                              color="gray.800"
                            >
                              {formData.name || "Name"}
                            </Text>
                            <HStack gap={4} wrap="wrap">
                              <Badge colorPalette="blue" px={3} py={1}>
                                {getGenderIcon(formData.gender)}{" "}
                                {t(`gender.${formData.gender.toLowerCase()}`)}
                              </Badge>
                              <Badge colorPalette="green" px={3} py={1}>
                                {getOccupationIcon(formData.occupation)}{" "}
                                {t(
                                  `occupation.${formData.occupation.toLowerCase()}`
                                )}
                              </Badge>
                            </HStack>
                            {formData.phone && (
                              <Text
                                fontSize="sm"
                                color="gray.600"
                                fontFamily="mono"
                              >
                                📞 {formData.phone}
                              </Text>
                            )}
                          </VStack>
                        </HStack>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                </>
              )}
            </VStack>
          </Box>

          <Box p={8} pt={0}>
            <Flex w="100%" gap={4}>
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                flex={1}
                size="lg"
                borderRadius="xl"
              >
                ❌ {t("actions.cancel")}
              </Button>
              <Button
                type="submit"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
                loading={isSubmitting}
                loadingText={
                  user
                    ? t("actions.update") + "..."
                    : t("actions.create") + "..."
                }
                flex={2}
                size="lg"
                borderRadius="xl"
                fontWeight="bold"
                shadow="lg"
                _hover={{
                  bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                }}
              >
                {user
                  ? `✏️ ${t("modal.updateUser")}`
                  : `👤 ${t("modal.createUser")}`}
              </Button>
            </Flex>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default UserModal;
