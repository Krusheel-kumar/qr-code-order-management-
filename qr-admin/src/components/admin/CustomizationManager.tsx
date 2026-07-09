import React, { useState, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, ChevronDown, ChevronRight,
  X, Loader2, Settings2, Tag,
  ToggleLeft, ToggleRight, PackageOpen
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { CustomizationGroup, CustomizationOption } from '../../data/models';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GroupFormData {
  id: string;
  name: string;
  minSelections: number;
  maxSelections: number;
  freeSelectionsLimit: number;
  isRequired: boolean;
}

interface OptionFormData {
  id: string;
  groupId: string;
  name: string;
  defaultPrice: number;
  isAvailable: boolean;
}

const emptyGroupForm = (): GroupFormData => ({
  id: '', name: '', minSelections: 0, maxSelections: 1, freeSelectionsLimit: 0, isRequired: false,
});

const emptyOptionForm = (groupId = ''): OptionFormData => ({
  id: '', groupId, name: '', defaultPrice: 0, isAvailable: true,
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToggleSwitch({
  checked, onChange, disabled, label,
}: { checked: boolean; onChange: () => void; disabled?: boolean; label?: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      title={label}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD54F]/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
        checked ? 'bg-[#22C55E]' : 'bg-[#D1B89A]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}



// ─── Group Form Modal ─────────────────────────────────────────────────────────

function GroupFormModal({
  initialData, onSave, onClose,
}: {
  initialData?: CustomizationGroup | null;
  onSave: (data: GroupFormData, editId?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<GroupFormData>(
    initialData
      ? { id: initialData.id, name: initialData.name, minSelections: initialData.minSelections,
          maxSelections: initialData.maxSelections, freeSelectionsLimit: initialData.freeSelectionsLimit,
          isRequired: initialData.isRequired }
      : emptyGroupForm()
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.id.trim()) e.id = 'Group ID is required';
    if (!form.name.trim()) e.name = 'Display name is required';
    if (form.minSelections < 0) e.minSelections = 'Cannot be negative';
    if (form.maxSelections < 1) e.maxSelections = 'Must be at least 1';
    if (form.freeSelectionsLimit < 0) e.freeSelectionsLimit = 'Cannot be negative';
    if (form.minSelections > form.maxSelections) e.minSelections = 'Min cannot exceed Max';
    if (form.freeSelectionsLimit > form.maxSelections) e.freeSelectionsLimit = 'Cannot exceed Max';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form, initialData?.id);
      onClose();
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof GroupFormData, type = 'text', extra?: any) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key] as any}
        onChange={e => {
          const val = type === 'number' ? Number(e.target.value) : e.target.value;
          setForm({ ...form, [key]: val });
          setErrors({ ...errors, [key]: '' });
        }}
        disabled={!!initialData && key === 'id'}
        {...extra}
        className={`w-full border rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium disabled:opacity-50 disabled:bg-gray-50 ${
          errors[key] ? 'border-red-400' : 'border-[#FAEDCD]'
        }`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#FAEDCD] w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-[#FAEDCD]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD54F]/20 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-[#B87A42]" />
            </div>
            <h3 className="text-base font-heading font-black text-[#2A1B16]">
              {initialData ? 'Edit Customization Group' : 'New Customization Group'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFF8E8] text-[#8D6E63] hover:text-[#2A1B16] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field('Group ID (unique key)', 'id', 'text', { placeholder: 'e.g. choice_of_milk' })}
            {field('Display Name', 'name', 'text', { placeholder: 'e.g. Choice Of Milk' })}
            {field('Min Selections', 'minSelections', 'number', { min: 0, placeholder: '0' })}
            {field('Max Selections', 'maxSelections', 'number', { min: 1, placeholder: '1' })}
            {field('Free Selections Limit', 'freeSelectionsLimit', 'number', { min: 0, placeholder: '0' })}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isRequired}
                  onChange={e => setForm({ ...form, isRequired: e.target.checked })}
                  className="w-4 h-4 accent-[#2A1B16] rounded"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A1B16]">Required Selection</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#FAEDCD]/50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-[#8D6E63] bg-white border border-[#FAEDCD] rounded-xl hover:bg-[#FFF8E8] cursor-pointer transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-[#FFD54F] bg-[#2A1B16] hover:bg-[#3D2921] rounded-xl cursor-pointer transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5">
              {saving && <Loader2 className="w-3 h-3 animate-spin" />}
              {saving ? 'Saving...' : 'Save Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Option Form Modal ────────────────────────────────────────────────────────

function OptionFormModal({
  groups, initialData, defaultGroupId, onSave, onClose,
}: {
  groups: CustomizationGroup[];
  initialData?: CustomizationOption | null;
  defaultGroupId?: string;
  onSave: (data: OptionFormData, editId?: string) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<OptionFormData>(
    initialData
      ? { id: initialData.id, groupId: initialData.groupId, name: initialData.name,
          defaultPrice: initialData.defaultPrice, isAvailable: initialData.isAvailable }
      : emptyOptionForm(defaultGroupId || groups[0]?.id || '')
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.id.trim()) e.id = 'Option ID is required';
    if (!form.name.trim()) e.name = 'Display name is required';
    if (!form.groupId) e.groupId = 'Parent group is required';
    if (form.defaultPrice < 0) e.defaultPrice = 'Price cannot be negative';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form, initialData?.id);
      onClose();
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#FAEDCD] w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-[#FAEDCD]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD54F]/20 flex items-center justify-center">
              <Tag className="w-4 h-4 text-[#B87A42]" />
            </div>
            <h3 className="text-base font-heading font-black text-[#2A1B16]">
              {initialData ? 'Edit Customization Option' : 'New Customization Option'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FFF8E8] text-[#8D6E63] hover:text-[#2A1B16] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Option ID</label>
              <input
                type="text"
                value={form.id}
                onChange={e => { setForm({ ...form, id: e.target.value }); setErrors({ ...errors, id: '' }); }}
                disabled={!!initialData}
                placeholder="e.g. opt-soy-milk"
                className={`w-full border rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium disabled:opacity-50 disabled:bg-gray-50 ${errors.id ? 'border-red-400' : 'border-[#FAEDCD]'}`}
              />
              {errors.id && <p className="text-xs text-red-500 mt-1">{errors.id}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Display Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                placeholder="e.g. Soy Milk"
                className={`w-full border rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium ${errors.name ? 'border-red-400' : 'border-[#FAEDCD]'}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Parent Group</label>
              <select
                value={form.groupId}
                onChange={e => { setForm({ ...form, groupId: e.target.value }); setErrors({ ...errors, groupId: '' }); }}
                disabled={!!initialData}
                className={`w-full border rounded-xl bg-white p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-semibold disabled:opacity-50 disabled:bg-gray-50 ${errors.groupId ? 'border-red-400' : 'border-[#FAEDCD]'}`}
              >
                <option value="" disabled>Select group...</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              {errors.groupId && <p className="text-xs text-red-500 mt-1">{errors.groupId}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8D6E63] mb-1.5">Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.defaultPrice}
                onChange={e => { setForm({ ...form, defaultPrice: Number(e.target.value) }); setErrors({ ...errors, defaultPrice: '' }); }}
                placeholder="0"
                className={`w-full border rounded-xl bg-white/80 p-3 text-sm text-[#2A1B16] outline-none focus:ring-4 focus:ring-[#FFD54F]/20 focus:border-[#FFD54F] transition-all font-medium ${errors.defaultPrice ? 'border-red-400' : 'border-[#FAEDCD]'}`}
              />
              {errors.defaultPrice && <p className="text-xs text-red-500 mt-1">{errors.defaultPrice}</p>}
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <ToggleSwitch checked={form.isAvailable} onChange={() => setForm({ ...form, isAvailable: !form.isAvailable })} />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A1B16]">
                {form.isAvailable ? 'Available in store' : 'Unavailable'}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-[#FAEDCD]/50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-[#8D6E63] bg-white border border-[#FAEDCD] rounded-xl hover:bg-[#FFF8E8] cursor-pointer transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-[#FFD54F] bg-[#2A1B16] hover:bg-[#3D2921] rounded-xl cursor-pointer transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5">
              {saving && <Loader2 className="w-3 h-3 animate-spin" />}
              {saving ? 'Saving...' : 'Save Option'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Option Row ───────────────────────────────────────────────────────────────

function OptionRow({
  option, onEdit, onDelete, onToggle,
}: {
  option: CustomizationOption;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 hover:bg-[#FFFDF5] transition-colors duration-150 border-b border-[#FAEDCD]/30 last:border-b-0 group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${option.isAvailable ? 'bg-[#22C55E]' : 'bg-[#D1B89A]'}`} />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-[#2A1B16] truncate">{option.name}</span>
            {option.defaultPrice === 0 ? (
              <span className="text-xs font-bold text-[#22C55E] bg-green-50 px-2 py-0.5 rounded-full">Free</span>
            ) : (
              <span className="text-xs font-black text-[#B87A42]">+₹{option.defaultPrice.toFixed(0)}</span>
            )}
          </div>
          <p className="text-xs text-[#8D6E63] font-mono mt-0.5">{option.id}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${option.isAvailable ? 'text-[#22C55E]' : 'text-[#8D6E63]'}`}>
            {option.isAvailable ? 'Available' : 'Unavailable'}
          </span>
          <ToggleSwitch checked={option.isAvailable} onChange={onToggle} label="Toggle availability" />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#2A1B16] hover:bg-[#FFD54F]/20 transition-colors cursor-pointer"
            title="Edit option"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete option"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Group Card ───────────────────────────────────────────────────────────────

function GroupCard({
  group, options, onEditGroup, onDeleteGroup, onToggleGroup,
  onAddOption, onEditOption, onDeleteOption, onToggleOption,
  isGroupActive,
}: {
  group: CustomizationGroup;
  options: CustomizationOption[];
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onToggleGroup: () => void;
  onAddOption: () => void;
  onEditOption: (opt: CustomizationOption) => void;
  onDeleteOption: (opt: CustomizationOption) => void;
  onToggleOption: (opt: CustomizationOption) => void;
  isGroupActive: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all duration-200 ${
      isGroupActive
        ? 'border-[#FAEDCD] bg-[#FFFDF8]'
        : 'border-[#E5D9C8] bg-[#F7F4EE] opacity-75'
    }`}>
      {/* Group Header */}
      <div className="px-5 py-4 flex items-center gap-3">
        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#FFF8E8] border border-[#FAEDCD] flex items-center justify-center text-[#8D6E63] hover:text-[#2A1B16] hover:bg-[#FFD54F]/20 transition-colors cursor-pointer"
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Group Info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-heading font-black text-sm tracking-tight ${isGroupActive ? 'text-[#2A1B16]' : 'text-[#8D6E63] line-through'}`}>
              {group.name}
            </h4>
            {group.isRequired && (
              <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">Required</span>
            )}
            <span className="text-xs font-bold text-[#B87A42] bg-[#FFF8E8] border border-[#FAEDCD] px-2.5 py-0.5 rounded-full">
              {options.length} option{options.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="font-mono text-xs text-[#8D6E63]">{group.id}</span>
            <span className="text-xs text-[#8D6E63]">Min: <b>{group.minSelections}</b> · Max: <b>{group.maxSelections}</b> · Free: <b>{group.freeSelectionsLimit}</b></span>
          </div>
        </div>

        {/* Group Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Active toggle */}
          <div className="flex items-center gap-2">
            <span className={`hidden sm:block text-xs font-semibold ${isGroupActive ? 'text-[#22C55E]' : 'text-[#8D6E63]'}`}>
              {isGroupActive ? 'Active' : 'Inactive'}
            </span>
            <ToggleSwitch checked={isGroupActive} onChange={onToggleGroup} label="Toggle group active" />
          </div>
          <div className="w-px h-5 bg-[#FAEDCD]" />
          <button
            onClick={onEditGroup}
            className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#2A1B16] hover:bg-[#FFD54F]/20 transition-colors cursor-pointer"
            title="Edit group"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDeleteGroup}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete group"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Options Section */}
      {expanded && (
        <div className="border-t border-[#FAEDCD]/60">
          {/* Options label */}
          <div className="px-5 py-2.5 bg-[#FFF8E8]/60 border-b border-[#FAEDCD]/40 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8D6E63]">Options</span>
            <button
              onClick={onAddOption}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2A1B16] bg-[#FFD54F] hover:bg-[#FFE57F] px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <Plus className="w-3 h-3" /> Add Option
            </button>
          </div>

          {/* Option list */}
          {options.length === 0 ? (
            <div className="px-6 py-8 flex flex-col items-center gap-2 text-center">
              <PackageOpen className="w-8 h-8 text-[#D1B89A]" />
              <p className="text-sm font-semibold text-[#8D6E63]">No customization options yet</p>
              <p className="text-xs text-[#B09080]">Click "Add Option" to create the first option for this group.</p>
            </div>
          ) : (
            <div>
              {options.map(opt => (
                <OptionRow
                  key={opt.id}
                  option={opt}
                  onEdit={() => onEditOption(opt)}
                  onDelete={() => onDeleteOption(opt)}
                  onToggle={() => onToggleOption(opt)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomizationManager() {
  const {
    customizationGroups,
    customizationOptions,
    addCustomizationGroup,
    updateCustomizationGroup,
    deleteCustomizationGroup,
    addCustomizationOption,
    updateCustomizationOption,
    deleteCustomizationOption,
  } = useAdminStore();

  // ── Modal state ──
  const [groupModal, setGroupModal] = useState<{ open: boolean; editing?: CustomizationGroup | null }>({ open: false });
  const [optionModal, setOptionModal] = useState<{ open: boolean; defaultGroupId?: string; editing?: CustomizationOption | null }>({ open: false });

  // ── Confirm dialog state ──
  // Replaced by window.confirm in handlers

  // ── Group active state (frontend-only, since backend has no isActive field) ──
  const [groupActiveState, setGroupActiveState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    customizationGroups.forEach(g => { init[g.id] = true; });
    return init;
  });

  // Keep group active state in sync when groups change
  React.useEffect(() => {
    setGroupActiveState(prev => {
      const next = { ...prev };
      customizationGroups.forEach(g => {
        if (!(g.id in next)) next[g.id] = true;
      });
      return next;
    });
  }, [customizationGroups]);

  // ── Handlers ──

  const handleSaveGroup = useCallback(async (data: GroupFormData, editId?: string) => {
    if (editId) {
      await updateCustomizationGroup(editId, data as CustomizationGroup);
    } else {
      await addCustomizationGroup(data as CustomizationGroup);
      setGroupActiveState(prev => ({ ...prev, [data.id]: true }));
    }
  }, [addCustomizationGroup, updateCustomizationGroup]);

  const handleSaveOption = useCallback(async (data: OptionFormData, editId?: string) => {
    if (editId) {
      await updateCustomizationOption(editId, data as CustomizationOption);
    } else {
      await addCustomizationOption(data as CustomizationOption);
    }
  }, [addCustomizationOption, updateCustomizationOption]);

    const handleDeleteGroup = async (group: CustomizationGroup) => {
      if (window.confirm(`Warning: Are you sure you want to delete the group "${group.name}"?`)) {
        if (window.confirm(`Final Warning: Deleting "${group.name}" will forcibly remove it from ALL mapped menu items. Proceed?`)) {
          try {
            await deleteCustomizationGroup(group.id);
          } catch (err: any) {
            const msg = err.response?.data?.message || err.message || '';
            alert(`Failed to delete group: ${msg}`);
          }
        }
      }
    };

    const handleDeleteOption = async (option: CustomizationOption) => {
      if (window.confirm(`Warning: Are you sure you want to delete the option "${option.name}"?`)) {
        if (window.confirm(`Final Warning: Deleting "${option.name}" will permanently remove it. Proceed?`)) {
          try {
            await deleteCustomizationOption(option.id);
          } catch (err: any) {
            const msg = err.response?.data?.message || err.message || '';
            alert(`Failed to delete option: ${msg}`);
          }
        }
      }
    };

  const handleToggleOption = async (option: CustomizationOption) => {
    try {
      await updateCustomizationOption(option.id, { ...option, isAvailable: !option.isAvailable });
    } catch (err: any) {
      alert(`Failed to toggle option: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleToggleGroup = (groupId: string) => {
    setGroupActiveState(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-black text-[#2A1B16] tracking-tight">Customization Engine</h3>
          <p className="text-xs text-[#8D6E63] font-medium mt-0.5">
            {customizationGroups.length} group{customizationGroups.length !== 1 ? 's' : ''} · {customizationOptions.length} option{customizationOptions.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setGroupModal({ open: true, editing: null })}
          className="bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Group
        </button>
      </div>

      {/* Groups List */}
      {customizationGroups.length === 0 ? (
        <div className="glass-panel rounded-2xl border border-[#FAEDCD] p-12 flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF8E8] border border-[#FAEDCD] flex items-center justify-center">
            <Settings2 className="w-6 h-6 text-[#D1B89A]" />
          </div>
          <h4 className="text-base font-heading font-black text-[#2A1B16]">No Customization Groups Yet</h4>
          <p className="text-sm text-[#8D6E63] max-w-xs">
            Create your first customization group (e.g. "Choice Of Milk", "Sugar Level") and then add options inside it.
          </p>
          <button
            onClick={() => setGroupModal({ open: true, editing: null })}
            className="mt-2 bg-[#2A1B16] hover:bg-[#3D2921] text-[#FFD54F] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create First Group
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {customizationGroups.map(group => {
            const groupOptions = customizationOptions.filter(o => o.groupId === group.id);
            const isActive = groupActiveState[group.id] !== false;
            return (
              <GroupCard
                key={group.id}
                group={group}
                options={groupOptions}
                isGroupActive={isActive}
                onEditGroup={() => setGroupModal({ open: true, editing: group })}
                onDeleteGroup={() => handleDeleteGroup(group)}
                onToggleGroup={() => handleToggleGroup(group.id)}
                onAddOption={() => setOptionModal({ open: true, defaultGroupId: group.id, editing: null })}
                onEditOption={(opt) => setOptionModal({ open: true, editing: opt })}
                onDeleteOption={(opt) => handleDeleteOption(opt)}
                onToggleOption={(opt) => handleToggleOption(opt)}
              />
            );
          })}
        </div>
      )}

      {/* Legend */}
      {customizationGroups.length > 0 && (
        <div className="flex items-center gap-6 text-xs text-[#8D6E63] font-medium">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#22C55E]" /> Available option</div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#D1B89A]" /> Unavailable option</div>
          <div className="flex items-center gap-1.5"><ToggleRight className="w-4 h-4 text-[#22C55E]" /> Group active</div>
          <div className="flex items-center gap-1.5"><ToggleLeft className="w-4 h-4 text-[#D1B89A]" /> Group inactive</div>
        </div>
      )}

      {/* Group Form Modal */}
      {groupModal.open && (
        <GroupFormModal
          initialData={groupModal.editing}
          onSave={handleSaveGroup}
          onClose={() => setGroupModal({ open: false })}
        />
      )}

      {/* Option Form Modal */}
      {optionModal.open && (
        <OptionFormModal
          groups={customizationGroups}
          initialData={optionModal.editing}
          defaultGroupId={optionModal.defaultGroupId}
          onSave={handleSaveOption}
          onClose={() => setOptionModal({ open: false })}
        />
      )}
    </div>
  );
}
