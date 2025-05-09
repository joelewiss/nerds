import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-rust'; // 👈 this is key!
import 'prism-themes/themes/prism-vsc-dark-plus.css'; // or another theme


const RUST_CODE = `/// Linked List Implementation
pub struct LinkedList {
    pub head: Option<Box<LinkedListNode>>
}
impl LinkedList {
    /// Create a new empty list
    pub fn new() -> Self {
        Self { head: None }
    }
}

/// Linked List Node Implementation
pub struct LinkedListNode {
    val: i32,
    pub next: Option<Box<LinkedListNode>>
}
impl LinkedListNode {
    /// Create a new node with val
    pub fn new(val: i32) -> Self {
        Self { val, next: None }
    }

    /// Get an immutable reference to this node's val
    pub fn get_val(&self) -> &i32 {
        &self.val
    }
}`


export default function ReferenceView() {
    useEffect(() => {
        Prism.highlightAll();
    }, []);


    return (
        <pre>
            <code style={{ fontSize: "120%" }} className="language-rust">
                {RUST_CODE}
            </code>
        </pre>
    )
}