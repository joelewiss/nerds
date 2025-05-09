/// Linked List Implementation
pub struct LinkedList {
    pub head: Option<Box<LinkedListNode>>,
}
impl LinkedList {
    pub fn new() -> Self { Self { head: None } }
}

/// Linked List Node Implementation
pub struct LinkedListNode {
    val: i32,
    pub next: Option<Box<LinkedListNode>>
}
impl LinkedListNode {
    pub fn new(val: i32) -> Self { Self { val, next: None } }
    pub fn get_val(&self) -> &i32 { &self.val }
}