#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing missing exports in UI components and modules...\n');

// Common UI components that should be exported
const uiComponents = [
  { file: 'components/ui/button.tsx', exports: ['Button', 'buttonVariants'] },
  { file: 'components/ui/input.tsx', exports: ['Input'] },
  { file: 'components/ui/card.tsx', exports: ['Card', 'CardHeader', 'CardFooter', 'CardTitle', 'CardDescription', 'CardContent'] },
  { file: 'components/ui/badge.tsx', exports: ['Badge', 'badgeVariants'] },
  { file: 'components/ui/avatar.tsx', exports: ['Avatar', 'AvatarImage', 'AvatarFallback'] },
  { file: 'components/ui/select.tsx', exports: ['Select', 'SelectGroup', 'SelectValue', 'SelectTrigger', 'SelectContent', 'SelectLabel', 'SelectItem', 'SelectSeparator', 'SelectScrollUpButton', 'SelectScrollDownButton'] },
  { file: 'components/ui/tabs.tsx', exports: ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'] },
  { file: 'components/ui/textarea.tsx', exports: ['Textarea'] },
  { file: 'components/ui/dropdown-menu.tsx', exports: ['DropdownMenu', 'DropdownMenuTrigger', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuCheckboxItem', 'DropdownMenuRadioItem', 'DropdownMenuLabel', 'DropdownMenuSeparator', 'DropdownMenuShortcut', 'DropdownMenuGroup', 'DropdownMenuPortal', 'DropdownMenuSub', 'DropdownMenuSubContent', 'DropdownMenuSubTrigger', 'DropdownMenuRadioGroup'] },
  { file: 'components/ui/dialog.tsx', exports: ['Dialog', 'DialogPortal', 'DialogOverlay', 'DialogClose', 'DialogTrigger', 'DialogContent', 'DialogHeader', 'DialogFooter', 'DialogTitle', 'DialogDescription'] },
  { file: 'components/ui/toast.tsx', exports: ['Toast', 'ToastAction', 'ToastClose', 'ToastDescription', 'ToastProvider', 'ToastTitle', 'ToastViewport'] },
  { file: 'components/ui/use-toast.ts', exports: ['useToast', 'toast'] },
  { file: 'components/ui/toaster.tsx', exports: ['Toaster'] },
  { file: 'components/ui/form.tsx', exports: ['useFormField', 'Form', 'FormItem', 'FormLabel', 'FormControl', 'FormDescription', 'FormMessage', 'FormField'] },
  { file: 'components/ui/label.tsx', exports: ['Label'] },
  { file: 'components/ui/separator.tsx', exports: ['Separator'] },
  { file: 'components/ui/sheet.tsx', exports: ['Sheet', 'SheetPortal', 'SheetOverlay', 'SheetTrigger', 'SheetClose', 'SheetContent', 'SheetHeader', 'SheetFooter', 'SheetTitle', 'SheetDescription'] },
  { file: 'components/ui/skeleton.tsx', exports: ['Skeleton'] },
  { file: 'components/ui/switch.tsx', exports: ['Switch'] },
  { file: 'components/ui/table.tsx', exports: ['Table', 'TableHeader', 'TableBody', 'TableFooter', 'TableHead', 'TableRow', 'TableCell', 'TableCaption'] },
  { file: 'components/ui/tooltip.tsx', exports: ['Tooltip', 'TooltipTrigger', 'TooltipContent', 'TooltipProvider'] },
  { file: 'components/ui/progress.tsx', exports: ['Progress'] },
  { file: 'components/ui/scroll-area.tsx', exports: ['ScrollArea', 'ScrollBar'] },
  { file: 'components/ui/popover.tsx', exports: ['Popover', 'PopoverTrigger', 'PopoverContent'] },
  { file: 'components/ui/checkbox.tsx', exports: ['Checkbox'] },
  { file: 'components/ui/radio-group.tsx', exports: ['RadioGroup', 'RadioGroupItem'] },
  { file: 'components/ui/slider.tsx', exports: ['Slider'] },
  { file: 'components/ui/toggle.tsx', exports: ['Toggle', 'toggleVariants'] },
  { file: 'components/ui/alert.tsx', exports: ['Alert', 'AlertDescription', 'AlertTitle'] },
  { file: 'components/ui/alert-dialog.tsx', exports: ['AlertDialog', 'AlertDialogPortal', 'AlertDialogOverlay', 'AlertDialogTrigger', 'AlertDialogContent', 'AlertDialogHeader', 'AlertDialogFooter', 'AlertDialogTitle', 'AlertDialogDescription', 'AlertDialogAction', 'AlertDialogCancel'] },
  { file: 'components/ui/accordion.tsx', exports: ['Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent'] },
  { file: 'components/ui/aspect-ratio.tsx', exports: ['AspectRatio'] },
  { file: 'components/ui/breadcrumb.tsx', exports: ['Breadcrumb', 'BreadcrumbList', 'BreadcrumbItem', 'BreadcrumbLink', 'BreadcrumbPage', 'BreadcrumbSeparator', 'BreadcrumbEllipsis'] },
  { file: 'components/ui/calendar.tsx', exports: ['Calendar'] },
  { file: 'components/ui/carousel.tsx', exports: ['Carousel', 'CarouselContent', 'CarouselItem', 'CarouselPrevious', 'CarouselNext'] },
  { file: 'components/ui/chart.tsx', exports: ['ChartContainer', 'ChartTooltip', 'ChartTooltipContent', 'ChartLegend', 'ChartLegendContent'] },
  { file: 'components/ui/collapsible.tsx', exports: ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent'] },
  { file: 'components/ui/command.tsx', exports: ['Command', 'CommandDialog', 'CommandInput', 'CommandList', 'CommandEmpty', 'CommandGroup', 'CommandItem', 'CommandShortcut', 'CommandSeparator'] },
  { file: 'components/ui/context-menu.tsx', exports: ['ContextMenu', 'ContextMenuTrigger', 'ContextMenuContent', 'ContextMenuItem', 'ContextMenuCheckboxItem', 'ContextMenuRadioItem', 'ContextMenuLabel', 'ContextMenuSeparator', 'ContextMenuShortcut', 'ContextMenuGroup', 'ContextMenuPortal', 'ContextMenuSub', 'ContextMenuSubContent', 'ContextMenuSubTrigger', 'ContextMenuRadioGroup'] },
  { file: 'components/ui/drawer.tsx', exports: ['Drawer', 'DrawerPortal', 'DrawerOverlay', 'DrawerTrigger', 'DrawerClose', 'DrawerContent', 'DrawerHeader', 'DrawerFooter', 'DrawerTitle', 'DrawerDescription'] },
  { file: 'components/ui/hover-card.tsx', exports: ['HoverCard', 'HoverCardTrigger', 'HoverCardContent'] },
  { file: 'components/ui/input-otp.tsx', exports: ['InputOTP', 'InputOTPGroup', 'InputOTPSlot', 'InputOTPSeparator'] },
  { file: 'components/ui/menubar.tsx', exports: ['Menubar', 'MenubarMenu', 'MenubarTrigger', 'MenubarContent', 'MenubarItem', 'MenubarSeparator', 'MenubarLabel', 'MenubarCheckboxItem', 'MenubarRadioGroup', 'MenubarRadioItem', 'MenubarPortal', 'MenubarSubContent', 'MenubarSubTrigger', 'MenubarGroup', 'MenubarSub', 'MenubarShortcut'] },
  { file: 'components/ui/navigation-menu.tsx', exports: ['NavigationMenu', 'NavigationMenuList', 'NavigationMenuItem', 'NavigationMenuContent', 'NavigationMenuTrigger', 'NavigationMenuLink', 'NavigationMenuIndicator', 'NavigationMenuViewport'] },
  { file: 'components/ui/pagination.tsx', exports: ['Pagination', 'PaginationContent', 'PaginationEllipsis', 'PaginationItem', 'PaginationLink', 'PaginationNext', 'PaginationPrevious'] },
  { file: 'components/ui/resizable.tsx', exports: ['ResizablePanelGroup', 'ResizablePanel', 'ResizableHandle'] },
  { file: 'components/ui/sonner.tsx', exports: ['Toaster'] },
  { file: 'components/ui/toggle-group.tsx', exports: ['ToggleGroup', 'ToggleGroupItem'] },
  { file: 'components/ui/tooltip-fallback.tsx', exports: ['TooltipProvider', 'Tooltip', 'TooltipTrigger', 'TooltipContent'] }
];

// Other important modules
const otherModules = [
  { file: 'components/providers/web3-provider.tsx', exports: ['Web3Provider', 'useWeb3'] },
  { file: 'lib/groq-service.ts', exports: ['generateStoryContent', 'analyzeStoryContent', 'generateStoryIdeas', 'improveStoryContent', 'GROQ_MODELS'] },
  { file: 'lib/utils.ts', exports: ['cn'] },
  { file: 'components/loading-screen.tsx', exports: ['LoadingScreen'] },
  { file: 'components/community-feed.tsx', exports: ['CommunityFeed'] }
];

function fixExportsInFile(filePath, expectedExports) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    console.log(`🔍 Processing ${filePath}...`);
    
    // Check if file has any exports
    const hasExports = content.includes('export');
    
    // Check for each expected export
    const missingExports = [];
    for (const exportName of expectedExports) {
      const exportPattern = new RegExp(`export.*${exportName}`, 'g');
      if (!content.match(exportPattern)) {
        missingExports.push(exportName);
      }
    }
    
    if (missingExports.length > 0) {
      console.log(`  ❌ Missing exports: ${missingExports.join(', ')}`);
      
      // Add missing exports at the end of the file
      const exportStatement = `\nexport { ${expectedExports.join(', ')} };\n`;
      
      // Remove any existing incomplete export statements
      content = content.replace(/export\s*\{\s*\}\s*;?\s*$/g, '');
      
      // Add the complete export statement
      if (!content.endsWith('\n')) {
        content += '\n';
      }
      content += exportStatement;
      
      fs.writeFileSync(fullPath, content);
      modified = true;
      console.log(`  ✅ Added exports: ${expectedExports.join(', ')}`);
    } else {
      console.log(`  ✅ All exports present`);
    }
    
    return modified;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process all UI components
console.log('🎨 Processing UI components...');
let totalFixed = 0;

for (const component of uiComponents) {
  if (fixExportsInFile(component.file, component.exports)) {
    totalFixed++;
  }
}

console.log('\n📦 Processing other modules...');
for (const module of otherModules) {
  if (fixExportsInFile(module.file, module.exports)) {
    totalFixed++;
  }
}

console.log(`\n✨ Fixed missing exports in ${totalFixed} files`);
console.log('🚀 Ready to test build again!');
