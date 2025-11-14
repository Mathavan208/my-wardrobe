// src/components/clothing/ClothingForm.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import { useClothing } from "../../context/ClothingContext";

// Predefined color options
const colorOptions = [
  "White", "Black", "Gray", "Navy", "Blue", "Red", "Green", "Yellow",
  "Pink", "Purple", "Orange", "Brown", "Beige", "Khaki", "Cream", "Silver",
  "other"
];

const clothingTypes = {
  shirt: {
    fields: ["sleeveLength", "style", "pattern", "material"],
    options: {
      sleeveLength: ["Full Sleeve", "Half Sleeve", "Sleeveless"],
      style: ["Formal", "Casual", "Party"],
      pattern: ["Solid", "Striped", "Checked", "Printed"],
      material: ["Cotton", "Polyester", "Linen", "Silk", "Blend"]
    }
  },
  tshirt: {
    fields: ["sleeveLength", "style", "pattern", "material"],
    options: {
      sleeveLength: ["Full Sleeve", "Half Sleeve", "Sleeveless"],
      style: ["Casual", "Sports", "Graphic"],
      pattern: ["Solid", "Graphic", "Text", "Striped"],
      material: ["Cotton", "Polyester", "Blend"]
    }
  },
  pants: {
    fields: ["pantsType", "fit", "material"],
    options: {
      pantsType: ["Jeans", "Trousers", "Cargo", "Track Pants", "Chinos", "Shorts"],
      fit: ["Slim Fit", "Regular Fit", "Baggy", "Skinny"],
      material: ["Denim", "Cotton", "Polyester", "Nylon", "Blend"]
    }
  },
  innerwear: {
    fields: ["innerwearType", "material"],
    options: {
      innerwearType: ["Briefs", "Boxers", "Trunks", "Vests"],
      material: ["Cotton", "Modal", "Synthetic Blend"]
    }
  },
  shoes: {
    fields: ["shoesType", "style", "material"],
    options: {
      shoesType: ["Sneakers", "Formal Shoes", "Sandals", "Boots", "Loafers", "Sports Shoes"],
      style: ["Casual", "Formal", "Sports", "Outdoor"],
      material: ["Leather", "Canvas", "Synthetic", "Rubber"]
    }
  }
};

// Color chart data
const colorChart = [
  "#FFFFFF", "#000000", "#808080", "#1E3A8A", "#2563EB", "#DC2626",
  "#22C55E", "#EAB308", "#EC4899", "#8B5CF6", "#F97316", "#92400E",
  "#F5F5DC", "#D1C5A3", "#FFFDD0", "#C0C0C0"
];


const ClothingForm = ({ isOpen, onClose, editingItem = null }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingItem?.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customColor, setCustomColor] = useState("");
  const [showColorChart, setShowColorChart] = useState(false);

  const { addClothing, updateClothing } = useClothing();

  const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm({
    defaultValues: editingItem || {
      type: "shirt",
      name: "",
      color: "",
      brand: "",
      size: "",
      favorite: false
    }
  });

  // handle editing state
  useEffect(() => {
    if (editingItem) {
      reset({
        type: editingItem.type,
        name: editingItem.name,
        color: editingItem.color,
        brand: editingItem.brand,
        size: editingItem.size,
        favorite: editingItem.favorite
      });
      if (editingItem.imageUrl) setImagePreview(editingItem.imageUrl);
    }
  }, [editingItem]);

  const selectedType = watch("type");
  const typeConfig = clothingTypes[selectedType] || clothingTypes.shirt;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    if (value === "other") {
      setCustomColor("#000000");
      setValue("color", "#000000");
    } else {
      setCustomColor("");
      setValue("color", value);
    }
  };

  const selectColorFromChart = (color) => {
    setValue("color", color);
    setCustomColor("");
    setShowColorChart(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      const finalData = {
        ...data,
        color: customColor || data.color
      };

      if (editingItem) {
        await updateClothing(editingItem.id, finalData, imageFile);
      } else {
        await addClothing(finalData, imageFile);
      }

      reset();
      setImageFile(null);
      setImagePreview("");
      setCustomColor("");

      onClose();
    } catch (err) {
      setError(err.message || "Failed to save clothing item.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setImageFile(null);
    setImagePreview("");
    setCustomColor("");
    setError("");
    onClose();
  };

  const getFieldLabel = (field) => {
    switch (field) {
      case "pantsType":
      case "innerwearType":
      case "shoesType":
        return "Type";
      default:
        return field.replace(/([A-Z])/g, " $1").trim();
    }
  };

  return (
    <>
      {/* Main Form Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold">
            {editingItem ? "Edit Clothing Item" : "Add New Clothing Item"}
          </h3>

          {error && <div className="p-3 mb-4 text-red-700 bg-red-100 border">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* LEFT SIDE */}
              <div>
                <Input
                  label="Item Name"
                  placeholder="e.g., Blue Striped Shirt"
                  {...register("name", { required: "Item name is required" })}
                  error={errors.name?.message}
                />

                {/* TYPE */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Type</label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="shirt">Shirt</option>
                    <option value="tshirt">T-Shirt</option>
                    <option value="pants">Pants</option>
                    <option value="innerwear">Innerwear</option>
                    <option value="shoes">Shoes</option>
                  </select>
                </div>

                {/* COLOR */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Color</label>
                  <div className="flex items-center gap-2">
                    <select
                      {...register("color", { required: true })}
                      onChange={handleColorChange}
                      className="w-full px-3 py-2 border rounded"
                    >
                      <option value="">Select a color</option>
                      {colorOptions.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>

                    {/* Color Chart Button */}
                    <button
                      type="button"
                      onClick={() => setShowColorChart(true)}
                      className="px-3 py-2 border rounded"
                    >
                      Chart
                    </button>
                  </div>
                </div>

                <Input label="Brand" {...register("brand")} />
                <Input label="Size" {...register("size")} />
              </div>

              {/* RIGHT SIDE */}
              <div>
                {typeConfig.fields.map((field) => (
                  <div key={field} className="mb-4">
                    <label className="block mb-1 text-sm font-medium">
                      {getFieldLabel(field)}
                    </label>
                    <select {...register(field)} className="w-full px-3 py-2 border rounded">
                      <option value="">Select {getFieldLabel(field)}</option>
                      {typeConfig.options[field].map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}

                {/* IMAGE */}
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {imagePreview && (
                  <img src={imagePreview} className="object-cover w-full h-32 mb-4 rounded" />
                )}

                <div className="flex items-center">
                  <input type="checkbox" {...register("favorite")} />
                  <label className="ml-2 text-sm">Mark as favorite</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : editingItem ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* COLOR CHART MODAL */}
      <Modal isOpen={showColorChart} onClose={() => setShowColorChart(false)} size="sm">
        <h3 className="mb-4 text-lg font-semibold">Select a Color</h3>

        <div className="grid grid-cols-4 gap-3 p-2">
          {colorChart.map((c) => (
            <div
              key={c}
              onClick={() => selectColorFromChart(c)}
              className="w-12 h-12 border rounded shadow cursor-pointer"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ClothingForm;
